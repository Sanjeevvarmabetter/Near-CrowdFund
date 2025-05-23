import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { SiNear } from 'react-icons/si';
import { MdInfoOutline } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-semibold text-sky-400">
            NearCrowdFund – Ignitus Networks
          </h2>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>

        <div className="flex space-x-6 text-sm text-gray-400">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-sky-400 transition duration-200"
          >
            <FaGithub size={18} />
            <span>GitHub</span>
          </a>
          <a
            href="https://near.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-sky-400 transition duration-200"
          >
            <SiNear size={18} />
            <span>NEAR Protocol</span>
          </a>
          <a
            href="/about"
            className="flex items-center space-x-1 hover:text-sky-400 transition duration-200"
          >
            <MdInfoOutline size={18} />
            <span>About Us</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
