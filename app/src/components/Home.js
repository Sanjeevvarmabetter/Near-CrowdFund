import React from 'react';

const Home = ({ onRouteChange }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-b from-gray-900 via-black to-gray-800">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            Near Blockchain
          </span>{" "}
          <span className="block">Crowdfunding Platform</span>
        </h1>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          A decentralized solution to support impactful projects. Fund campaigns transparently and securely using NEAR Protocol.
        </p>
        <button
          onClick={() => onRouteChange('explore')}
          className="px-6 py-3 bg-purple-500 hover:bg-sky-600 text-white rounded-lg text-lg font-medium transition duration-200"
        >
          🚀 Explore Campaigns
        </button>
      </div>
    </div>
  );
};

export default Home;
