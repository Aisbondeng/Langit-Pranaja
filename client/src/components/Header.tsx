import React, { useState } from "react";
import Logo from "./Logo";
import { useLocation } from "wouter";

const Header: React.FC = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [, setLocation] = useLocation();

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
  };

  const toggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    if (sidebar && overlay) {
      sidebar.classList.toggle("-translate-x-full");
      overlay.classList.toggle("hidden");
    }
  };

  return (
    <header className="bg-dark-DEFAULT border-b border-dark-lighter">
      <div className="flex items-center justify-between p-4">
        {/* Logo and Title */}
        <div className="flex items-center">
          <Logo className="mr-3" />
          <h1 className="text-xl font-bold font-montserrat text-white">PRANAJA ARISHAF STUDIO</h1>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-3">
          <button
            className="text-gray-400 hover:text-white"
            onClick={toggleSearch}
          >
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
          </button>
          <button
            className="text-gray-400 hover:text-white md:hidden"
            onClick={toggleSidebar}
          >
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Search Input */}
      {isSearchVisible && (
        <div className="px-4 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search songs, artists, albums..."
              className="w-full bg-dark-lighter border-0 rounded-full py-2 px-4 pl-10 text-white focus:outline-none focus:ring-1 focus:ring-secondary"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
