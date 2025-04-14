import * as React from "react";

interface MenuProps {
  children: React.ReactNode;
}

interface MenuItemProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ children }) => {
  return (
    <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-dark-lighter shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
      <div className="py-1">{children}</div>
    </div>
  );
};

export const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-dark-DEFAULT hover:text-white text-left"
    >
      {children}
    </button>
  );
};
