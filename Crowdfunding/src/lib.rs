use near_sdk::{
    env, near_bindgen, AccountId, Promise, PanicOnDefault,
    borsh::{self, BorshDeserialize, BorshSerialize},
    serde::{Deserialize, Serialize},
    collections::UnorderedMap,
    json_types::U64,
    NearToken,
};
use std::collections::HashMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Crowdfunding {
    campaigns: HashMap<u64, Campaign>,
    next_campaign_id: u64,
    platform_wallet: AccountId,

    tokens: UnorderedMap<u64, NftToken>,
    next_token_id: u64,
    access_rights: UnorderedMap<(u64, AccountId), bool>,
}

// === Campaign Structs ===

#[derive(BorshSerialize, BorshDeserialize, Clone, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct Campaign {
    creator: AccountId,
    image: String,
    title: String,
    description: String,
    target: u128,
    deadline: u64,
    amount_collected: u128,
    donations: HashMap<AccountId, u128>,
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct CampaignView {
    pub creator: String,
    pub image: String,
    pub title: String,
    pub description: String,
    pub target: String,
    pub deadline: u64,
    pub amount_collected: String,
}

impl Campaign {
    pub fn to_view(&self) -> CampaignView {
        CampaignView {
            creator: self.creator.to_string(),
            image: self.image.clone(),
            title: self.title.clone(),
            description: self.description.clone(),
            target: self.target.to_string(),
            deadline: self.deadline,
            amount_collected: self.amount_collected.to_string(),
        }
    }
}

// === NFT Structs ===

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct NftToken {
    owner_id: AccountId,
    metadata: TokenMetadata,
    for_sale: bool,
    price: Option<u128>,
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct TokenMetadata {
    title: String,
    description: String,
    media: String,
}

// === Main Smart Contract Implementation ===

#[near_bindgen]
impl Crowdfunding {
    #[init]
    pub fn new(platform_wallet: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            campaigns: HashMap::new(),
            next_campaign_id: 0,
            platform_wallet,
            tokens: UnorderedMap::new(b"t".to_vec()),
            next_token_id: 0,
            access_rights: UnorderedMap::new(b"a".to_vec()),
        }
    }

    #[payable]
    pub fn create_campaign(
        &mut self,
        image: String,
        title: String,
        description: String,
        target: U64,
        deadline: u64,
    ) {
        let attached_deposit: NearToken = env::attached_deposit();
        let required_fee: NearToken = NearToken::from_yoctonear(10_000_000_000_000_000_000_000);

        assert!(
            attached_deposit >= required_fee,
            "Attach at least 0.01 NEAR"
        );

        let campaign = Campaign {
            creator: env::predecessor_account_id(),
            image,
            title,
            description,
            target: target.0 as u128,
            deadline,
            amount_collected: 0,
            donations: HashMap::new(),
        };

        self.campaigns.insert(self.next_campaign_id, campaign);
        self.next_campaign_id += 1;
    }

    #[payable]
    pub fn donate(&mut self, campaign_id: u64) {
        let campaign = self
            .campaigns
            .get_mut(&campaign_id)
            .expect("Campaign not found");

        assert!(
            env::block_timestamp() <= campaign.deadline,
            "Campaign has ended"
        );

        let donation_token: NearToken = env::attached_deposit();
        let donation_amount = donation_token.as_yoctonear();
        let donor = env::predecessor_account_id();

        let prev = campaign.donations.get(&donor).cloned().unwrap_or(0);
        let new = prev.checked_add(donation_amount).expect("Donation overflow");

        campaign.donations.insert(donor.clone(), new);

        campaign.amount_collected = campaign
            .amount_collected
            .checked_add(donation_amount)
            .expect("Amount overflow");

        let creator_share = donation_amount * 90 / 100;
        let platform_share = donation_amount - creator_share;

        Promise::new(campaign.creator.clone()).transfer(NearToken::from_yoctonear(creator_share));
        Promise::new(self.platform_wallet.clone()).transfer(NearToken::from_yoctonear(platform_share));
    }

    pub fn get_campaigns(&self) -> Vec<(u64, CampaignView)> {
        self.campaigns
            .iter()
            .map(|(&id, campaign)| (id, campaign.to_view()))
            .collect()
    }

    pub fn get_donations(&self, campaign_id: u64) -> Vec<(AccountId, String)> {
        let campaign = self.campaigns.get(&campaign_id).expect("Campaign not found");

        campaign
            .donations
            .iter()
            .map(|(account, amount)| (account.clone(), amount.to_string()))
            .collect()
    }

    pub fn set_platform_wallet(&mut self, new_wallet: AccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            self.platform_wallet,
            "Only platform owner can update"
        );
        self.platform_wallet = new_wallet;
    }

    #[payable]
    pub fn mint_nft(&mut self, title: String, description: String, media: String) -> u64 {
        let owner = env::predecessor_account_id();
        let token_id = self.next_token_id;

        let metadata = TokenMetadata { title, description, media };

        let token = NftToken {
            owner_id: owner,
            metadata,
            for_sale: false,
            price: None,
        };

        self.tokens.insert(&token_id, &token);
        self.next_token_id += 1;
        token_id
    }

    #[payable]
    pub fn list_nft_for_sale(&mut self, token_id: u64, price: U64) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        let caller = env::predecessor_account_id();
        assert_eq!(token.owner_id, caller, "Only owner can list");

        token.for_sale = true;
        token.price = Some(price.0 as u128);
        self.tokens.insert(&token_id, &token);
    }

    #[payable]
    pub fn buy_nft(&mut self, token_id: u64) {
        let token = self.tokens.get(&token_id).expect("Token not found");
        assert!(token.for_sale, "Not for sale");

        let price = token.price.expect("Price not set");
        let deposit = env::attached_deposit().as_yoctonear();
        assert!(deposit >= price, "Not enough deposit");

        let buyer = env::predecessor_account_id();
        let seller = token.owner_id.clone();
        assert_ne!(buyer, seller, "Cannot buy your own NFT");

        Promise::new(seller).transfer(NearToken::from_yoctonear(deposit));
        self.access_rights.insert(&(token_id, buyer), &true);
    }

    pub fn get_nft(&self, token_id: u64) -> Option<NftToken> {
        self.tokens.get(&token_id)
    }

    pub fn get_all_nfts(&self) -> Vec<(u64, NftToken)> {
        self.tokens.iter().collect()
    }

    pub fn has_access(&self, token_id: u64, user: AccountId) -> bool {
        self.access_rights.get(&(token_id, user)).unwrap_or(false)
    }
}