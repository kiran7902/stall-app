"use client";

import Link from "next/link";
import { Home, User, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3">
          {/* Home Button */}
          <Link href="/">
            <div
              className={`p-2 rounded-lg hover:bg-gray-200 transition ${
                pathname === "/" ? "bg-gray-300" : ""
              }`}
            >
              <Home size={24} className="text-gray-800" />
            </div>
          </Link>
    
          {/* Navigation Links */}
          {/*
          <div className="flex space-x-6">
            <Link href="/user">
              <div
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition ${
                  pathname === "/user" ? "bg-gray-300" : ""
                }`}
              >
                <User size={20} className="text-gray-800" />
                <span className="hidden sm:inline text-gray-800">User Page</span>
              </div>
            </Link>
    
            <Link href="/settings">
              <div
                className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-200 transition ${
                  pathname === "/settings" ? "bg-gray-300" : ""
                }`}
              >
                <Settings size={20} className="text-gray-800" />
                <span className="hidden sm:inline text-gray-800">Settings</span>
              </div>
            </Link>
          </div>
          */}
        </nav>
      );
};

export default Navbar;