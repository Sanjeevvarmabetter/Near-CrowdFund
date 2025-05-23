import React, { useState } from "react";
import CardList from "./CardList";
import '@/styles/app.module.css';

const Explore = ({ campaigns, isConnected, isLoading, fundCampaign}) => {
  const [filter, setFilter] = useState("all");

  const filteredCampaigns = campaigns.filter((campaign) => {
    if (filter === "open") return campaign.status !== "closed";
    if (filter === "closed") return campaign.status === "closed";
    return true;
  });

  return (
    <div className="flex flex-col justify-center items-center h-100 gradient-bg-welcome">
      <div className="flex mt-[50px] p-15 w-full justify-end items-end">
        <div>
        <select
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
          className="px-4 py-2 bg-gray-700 text-white rounded-md"
          >
          <option value="all">All Campaigns</option>
          <option value="open">Open Campaigns</option>
          <option value="closed">Closed Campaigns</option>
        </select>
          </div>
      </div>
      {isConnected ? (
        isLoading ? (
          <p className="text-white text-xl">Loading...</p>
        ) : (
          <CardList allCampaigns={filteredCampaigns} fundCampaign={fundCampaign}/>
        )
      ) : (
        <div className="text-center">
          <p className="text-white text-lg">Connect your wallet</p>
        </div>
      )}
    </div>
  );
};

export default Explore;
