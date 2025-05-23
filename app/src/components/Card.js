    import React, { useState } from "react";

    const Card = ({ id, title, image, description, deadline, targetAmount, amount_collected, status, fundCampaign }) => {
        const [fundAmount, setFundAmount] = useState("");

        const handleAmountChange = (e) => {
            setFundAmount(e.target.value);
        };

        const convertToIST = (timestamp) => {
            const timestampInSeconds = timestamp / 1_000_000_000;
            const date = new Date(timestampInSeconds * 1000);
            return new Intl.DateTimeFormat('en-IN', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: 'Asia/Kolkata'
            }).format(date);
        };

        return (
            <div className="w-full sm:w-[300px] md:w-[350px] lg:w-[400px] bg-gray-900 p-4 rounded-lg shadow-lg flex flex-col">
                {/* Image Section */}
                <div className="w-full h-[180px] flex justify-center items-center">
                    <img className="w-full h-full object-cover rounded-lg" alt="NFT" src={image} />
                </div>

                {/* Card Content */}
                <div className="flex-1 flex flex-col py-3">
                    <p className="text-white text-xl font-semibold truncate uppercase cursor-help" title={`Name: ${title}`}>
                        {title}
                    </p>
                    <p className="text-white text-sm mt-2 truncate max-w-[250px] cursor-help capitalize" title={`Description: ${description}`}>
                        {description}
                    </p>
                    <p className="text-white text-sm mt-2"><span className="font-semibold">Target: </span><span className="font-thin">{targetAmount}</span></p>
                    <p className="text-white text-sm mt-2"><span className="font-semibold">Collected: </span><span className="font-thin">{amount_collected}</span></p>
                    <p className="text-white text-sm mt-2"><span className="font-semibold">Deadline: </span><span className="font-thin">{convertToIST(deadline)}</span></p>
                </div>

                {/* Fund Input + Button (Fixed Inside Card) */}
                <div className="w-full mt-auto">
                    {status !== "closed" ? (
                        <div className="flex flex-col items-center gap-2">
                            <label htmlFor="fundAmount" className="text-xs text-white">Enter Amount:</label>
                            <input
                                id="fundAmount"
                                type="number"
                                value={fundAmount}
                                onChange={handleAmountChange}
                                placeholder="Amount"
                                className="w-full p-2 border border-gray-300 rounded-md bg-transparent text-white"
                            />
                            <div className="rounded-lg w-1/2 flex items-center justify-center overflow-hidden bg-purple-500 hover:bg-purple-600">
                            <button
                                onClick={() => fundCampaign(id, fundAmount)}
                                className="text-white p-2 "
                            >
                                Fund
                            </button>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg overflow-hidden">
                        <button disabled className="w-full bg-gray-400 text-white p-2 rounded-lg hover:cursor-not-allowed">
                            Closed
                        </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    export default Card;
