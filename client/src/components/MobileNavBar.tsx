import React from "react";
import { Link, useLocation } from "wouter";

const MobileNavBar: React.FC = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden bg-dark-DEFAULT border-t border-dark-lighter">
      <div className="flex justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center py-2 px-4 ${location === "/" ? "text-secondary" : "text-gray-400"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/browse">
          <a className={`flex flex-col items-center py-2 px-4 ${location === "/browse" ? "text-secondary" : "text-gray-400"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span className="text-xs mt-1">Browse</span>
          </a>
        </Link>
        <Link href="/library">
          <a className={`flex flex-col items-center py-2 px-4 ${location === "/library" ? "text-secondary" : "text-gray-400"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span className="text-xs mt-1">Library</span>
          </a>
        </Link>
        <Link href="/playlists">
          <a className={`flex flex-col items-center py-2 px-4 ${location === "/playlists" || location.startsWith('/playlist/') ? "text-secondary" : "text-gray-400"}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            <span className="text-xs mt-1">Playlists</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavBar;
