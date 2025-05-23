import { useContext, useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import Footer from "@/components/Footer";
import Home from "../components/Home";
import jws from "../contract/key.json";
import { PinataSDK } from "pinata-web3";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Create from "../components/Create";
import Explore from "../components/Explore";
import Login from "@/components/Login";
import { NearContext } from '@/wallets/near';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CrowdfundingNearContract } from "../config.js";
import "../styles/app.module.css";

const CONTRACT = CrowdfundingNearContract;

const pinata = new PinataSDK({
    pinataJwt: jws.jws,
    pinataGateway: "beige-sophisticated-baboon-74.mypinata.cloud",
});

function PrivateRoute({ children }) {
    const { currentUser } = useAuth();

    if (currentUser === undefined) return <div>Loading...</div>;
    if (!currentUser) return <Login />;
    return children;
}

const IndexPage = () => {
    const { signedAccountId, wallet } = useContext(NearContext);
    const [route, setRoute] = useState("home");
    const [connected, setConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [shouldFetchData, setShouldFetchData] = useState(false);
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        setConnected(!!signedAccountId);
    }, [signedAccountId]);

    useEffect(() => {
        async function getAllNFTs() {
            if (connected && signedAccountId) {
                try {
                    setIsLoading(true);
                    const campaigns = await wallet.viewMethod({
                        contractId: CONTRACT,
                        method: "get_campaigns",
                    });

                    const currentTimestamp = Math.floor(Date.now() / 1000);
                    const deadlineNs = currentTimestamp * 1_000_000_000;

                    const camp = campaigns.map(([id, campaign]) => {
                        const collected = parseFloat(campaign.amount_collected.split(" ")[0]);
                        const target = parseFloat(campaign.target.split(" ")[0]);

                        return {
                            id,
                            ...campaign,
                            status: campaign.deadline > deadlineNs && collected < target ? "open" : "closed",
                        };
                    });

                    setCampaigns(camp);
                    setShouldFetchData(false);
                    setIsLoading(false);
                } catch (error) {
                    console.error("Error fetching campaigns:", error);
                    toast.error("Error fetching campaigns", { position: "top-center" });
                }
            }
        }

        getAllNFTs();
    }, [shouldFetchData, connected, signedAccountId]);

    const onRouteChange = (route) => {
        setRoute(route);
    };

    const uploadToPinata = async (file) => {
        if (!file) throw new Error("File is required");

        try {
            toast.info("Uploading Image to IPFS", { position: "top-center" });
            const uploadImage = await pinata.upload.file(file);
            return `https://beige-sophisticated-baboon-74.mypinata.cloud/ipfs/${uploadImage.IpfsHash}`;
        } catch (error) {
            console.error("Error uploading to Pinata:", error);
            toast.error("IPFS Upload failed.", { position: "top-center" });
            throw error;
        }
    };

    const createFund = async (imageHash, title, description, targetAmount, time) => {
        try {
            const scaledTarget = BigInt(Math.round(targetAmount * 1e24)).toString();
            const scaledFee = BigInt(Math.round(0.01 * 1e24)).toString();

            const tx = await wallet.callMethod({
                contractId: CONTRACT,
                method: 'create_campaign',
                args: {
                    image: imageHash,
                    title,
                    description,
                    target: scaledTarget,
                    deadline: Number(time),
                },
                deposit: scaledFee,
            });

            toast.success("Campaign created!", { position: "top-center" });
            setShouldFetchData(true);
            onRouteChange("explore");
        } catch (e) {
            console.error("Error creating campaign:", e);
            toast.error("Error creating campaign", { position: "top-center" });
        }
    };

    const fundCampaign = async (id, amount) => {
        try {
            const scaledAmount = BigInt(Math.round(amount * 1e24)).toString();

            const tx = await wallet.callMethod({
                contractId: CONTRACT,
                method: "donate",
                args: { campaign_id: Number(id) },
                deposit: scaledAmount,
            });

            toast.success("Campaign Funded!", { position: "top-center" });
            setShouldFetchData(true);
        } catch (e) {
            console.error("Error funding campaign:", e);
            toast.error("Error funding campaign", { position: "top-center" });
        }
    };

    return (
        <AuthProvider>
            <ToastContainer />
            <Navbar onRouteChange={onRouteChange} />

            {/* Optional Signup Navigation */}
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <button onClick={() => onRouteChange("signup")}>Go to Signup</button>
            </div>

            {route === "home" ? (
                <Home onRouteChange={onRouteChange} />
            ) : route === "explore" ? (
                <Explore
                    campaigns={campaigns}
                    isConnected={connected}
                    isLoading={isLoading}
                    fundCampaign={fundCampaign}
                />
            ) : route === "create" ? (
                <PrivateRoute>
                    <Create uploadToPinata={uploadToPinata} createFund={createFund} />
                </PrivateRoute>
            ) : route === "signup" ? (
                <Signup />
            ) : (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>No page found</div>
            )}
            <Footer />
        </AuthProvider>
    );
};

export default IndexPage;
