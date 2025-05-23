import React from "react";
import Card from "./Card";
import '@/styles/app.module.css';

const CardList = ({ allCampaigns, fundCampaign }) => {

  let cardComponents = [];
  if (allCampaigns) {
    cardComponents = allCampaigns.map((data) => {
      return (
        <Card
          key={data.id}
          id={data.id}
          title={data.title}
          description={data.description}
          image={data.image}
          targetAmount={data.target}
          amount_collected={data.amount_collected}
          deadline={data.deadline}
          status={data.status}
          fundCampaign={fundCampaign}
        />
      );
    });
  }

  return (
    <div >
      {allCampaigns.length === 0 ? (
        <p>No Campaigns found.</p>
      ) : (
        <div className='flex flex-wrap gap-10 justify-center pb-5'>
          {cardComponents}
        </div>
      )}
    </div>
  );
};

export default CardList;