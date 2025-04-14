import React, { useEffect } from "react";
import { Link, useLocation } from "wouter";
import Logo from "./Logo";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useToast } from "@/hooks/use-toast";

const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { playlists } = usePlaylist();
  const { toast } = useToast();
  
  const closeSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    if (sidebar && overlay) {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }
  };

  const showSettings = () => {
    toast({
      title: "Settings",
      description: "Settings functionality will be implemented in a future update.",
    });
  };

  return (
    <>
      <div
        id="sidebar"
        className="fixed inset-y-0 left-0 w-64 bg-dark-DEFAULT border-r border-dark-lighter transform -translate-x-full transition-transform z-40 md:translate-x-0"
      >
        <div className="flex flex-col h-full">
          <div className="px-5 py-4">
            <div className="flex items-center">
              <Logo className="mr-3" />
              <h1 className="text-xl font-bold font-montserrat text-white">
                Pranaja Music
              </h1>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              <li>
                <Link href="/">
                  <a
                    className={`sidebar-item flex items-center px-4 py-3 hover:bg-dark-lighter rounded-md ${
                      location === "/"
                        ? "active text-white"
                        : "text-gray-300"
                    }`}
                    onClick={closeSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
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
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/browse">
                  <a
                    className={`sidebar-item flex items-center px-4 py-3 hover:bg-dark-lighter rounded-md ${
                      location === "/browse"
                        ? "active text-white"
                        : "text-gray-300"
                    }`}
                    onClick={closeSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                      />
                    </svg>
                    Browse
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/library">
                  <a
                    className={`sidebar-item flex items-center px-4 py-3 hover:bg-dark-lighter rounded-md ${
                      location === "/library"
                        ? "active text-white"
                        : "text-gray-300"
                    }`}
                    onClick={closeSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
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
                    Library
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/playlists">
                  <a
                    className={`sidebar-item flex items-center px-4 py-3 hover:bg-dark-lighter rounded-md ${
                      location === "/playlists" || location.startsWith('/playlist/')
                        ? "active text-white"
                        : "text-gray-300"
                    }`}
                    onClick={closeSidebar}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-3"
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
                    Playlists
                  </a>
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Your Playlists
              </h3>
              <ul className="mt-2 space-y-1">
                {playlists.map((playlist) => (
                  <li key={playlist.id}>
                    <Link href={`/playlist/${playlist.id}`}>
                      <a className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-lighter rounded-md" onClick={closeSidebar}>
                        <span className="truncate">{playlist.name}</span>
                      </a>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/playlists">
                    <a className="flex items-center px-4 py-2 text-sm text-secondary hover:bg-dark-lighter rounded-md" onClick={closeSidebar}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Create New Playlist
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="p-4 border-t border-dark-lighter">
            <button
              className="flex items-center px-4 py-2 text-gray-300 hover:bg-dark-lighter rounded-md w-full"
              onClick={showSettings}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </button>
          </div>
        </div>
      </div>
      {/* Sidebar Overlay */}
      <div
        id="sidebarOverlay"
        className="fixed inset-0 bg-black bg-opacity-50 z-30 hidden md:hidden"
        onClick={closeSidebar}
      ></div>
    </>
  );
};

export default Sidebar;
