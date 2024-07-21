"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="bg-white shadow-lg rounded border-collapse">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            href="/"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300"
          >
            Okanban
          </Link>
          <nav className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  href="/boards"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Boards
                </Link>
                <span className="text-gray-600">
                  Welcome, {user.name || user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  About
                </Link>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link href="/signup" passHref>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 
                                 hover:from-blue-600 hover:to-indigo-700 
                                 text-white font-semibold py-2 px-4 rounded-md 
                                 transition-all duration-300 ease-in-out
                                 focus:ring-2 focus:ring-blue-300 focus:outline-none
                                 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
