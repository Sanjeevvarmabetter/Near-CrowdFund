use near_sdk::{
    env, near_bindgen, AccountId, Promise, 
    NearToken,
};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use std::collections::HashMap;
use schemars::JsonSchema;

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
#[near_bindgen]
pub struct Crowdfunding {
    campaigns: HashMap<u64, Campaign>,
    next_campaign_id: u64,
    platform_wallet: AccountId,
}

impl Default for Crowdfunding {
    fn default() -> Self {
        Self {
            campaigns: HashMap::new(),
            next_campaign_id: 0,
            platform_wallet: "default.near".parse().unwrap(),
        }
    }
}

#[derive(BorshSerialize, BorshDeserialize, Clone, Serialize, Deserialize)]
pub struct Campaign {
    creator: AccountId,
    image: String,
    title: String,
    description: String,
    target: NearToken,
    deadline: u64,
    amount_collected: NearToken,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(crate = "near_sdk::serde")]
pub struct CampaignView {
    pub creator: String,
    pub image: String,
    pub title: String,
    pub description: String,
    pub target: String,        // changed NearToken as string
    pub deadline: u64,
    pub amount_collected: String,  // changed NearToken as string
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

#[near_bindgen]
impl Crowdfunding {
    #[init]
    pub fn new(platform_wallet: AccountId) -> Self {
        Self {
            campaigns: HashMap::new(),
            next_campaign_id: 0,
            platform_wallet,
        }
    }

    #[payable]
    pub fn create_campaign(
        &mut self,
        image: String,
        title: String,
        description: String,
        target: NearToken,
        deadline: u64,
    ) {
        let required_fee = NearToken::from_yoctonear(10_000_000_000_000_000_000_000); // 0.010 NEAR
        assert!(
            env::attached_deposit() >= required_fee,
            "You need to attach at least 0.010 NEAR to create a campaign"
        );

        let campaign = Campaign {
            creator: env::predecessor_account_id(),
            image,
            title,
            description,
            target,
            deadline,
            amount_collected: NearToken::from_near(0),
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

        env::log_str(&format!(
            "Current timestamp: {}, Deadline: {}",
            env::block_timestamp(),
            campaign.deadline
        ));

        assert!(
            env::block_timestamp() <= campaign.deadline,
            "Campaign has ended"
        );

        let donation_amount = env::attached_deposit();

        // Calculate the shares for the creator and platform
        let creator_share = NearToken::from_yoctonear(
            donation_amount.as_yoctonear() * 90 / 100
        ); // 90% of donation
        let platform_share = NearToken::from_yoctonear(
            donation_amount.as_yoctonear() * 10 / 100
        ); // 10% of donation

        // Update the campaign's collected amount
        campaign.amount_collected = campaign.amount_collected.checked_add(donation_amount)
            .expect("Overflow in donation amount");

        // Transfer the creator's share and platform share
        Promise::new(campaign.creator.clone()).transfer(creator_share);
        Promise::new(self.platform_wallet.clone()).transfer(platform_share);

    }

    pub fn get_campaigns(&self) -> Vec<(u64, CampaignView)> {
        env::log_str(&format!("Campaigns: {:?}", self.campaigns));  // Log the current campaigns
        self.campaigns
            .iter()
            .map(|(&id, campaign)| (id, campaign.to_view()))
            .collect()
    }
    

    pub fn set_platform_wallet(&mut self, new_wallet: AccountId) {
        assert_eq!(
            env::predecessor_account_id(),
            self.platform_wallet,
            "Only the current platform wallet can update this"
        );
        self.platform_wallet = new_wallet;
    }
}