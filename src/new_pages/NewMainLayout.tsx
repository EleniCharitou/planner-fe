import { Link, Outlet } from "react-router-dom";
import { MdCardTravel, MdOutlineModeOfTravel } from "react-icons/md";
import {
  BookOpen,
  Calendar,
  Home,
  LogOut,
  Menu,
  User,
  Video,
  X,
} from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function NewMainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-white font-bold text-xl"
              onClick={closeMobileMenu}
            >
              <MdCardTravel size="30px" />
              <span>Trip Planner</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-bold text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <Home size="18px" />
                <span>Home</span>
              </Link>

              <Link
                to="/program"
                className="text-bold text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <MdOutlineModeOfTravel size="18px" />
                <span>Plan Trip</span>
              </Link>

              <Link
                to="/during"
                className="text-bold text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <Calendar size="18px" />
                <span>Trips</span>
              </Link>

              <Link
                to="/memories"
                className="text-bold text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <Video size="18px" />
                <span>Memories</span>
              </Link>

              <Link
                to="/articles"
                className="text-bold text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <BookOpen size="18px" />
                <span>Articles</span>
              </Link>
            </div>

            <div className="hidden md:flex">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-white">
                    <User size="18px" />
                    <span className="text-sm">
                      {user?.first_name || user?.name || user?.email}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-white hover:text-teal-800 transition-colors duration-200 px-2 py-2 rounded-lg hover:bg-teal-500 hover:cursor-pointer"
                  >
                    <LogOut size="18px" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className=" text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1 px-2 py-2 border-1 border-white rounded-lg hover:bg-white"
                >
                  <span>Login | Sign Up</span>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white p-2"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-teal-700">
            <div className="px-6 pt-2 pb-4 space-y-3">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors duration-200 py-2"
              >
                <Home size="18px" />
                <span>Home</span>
              </Link>

              <Link
                to="/program"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors duration-200 py-2"
              >
                <MdOutlineModeOfTravel size="18px" />
                <span>Plan Trip</span>
              </Link>

              <Link
                to="/during"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors duration-200 py-2"
              >
                <Calendar size="18px" />
                <span>Trips</span>
              </Link>

              <Link
                to="/memories"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors duration-200 py-2"
              >
                <Video size="18px" />
                <span>Memories</span>
              </Link>

              <Link
                to="/articles"
                onClick={closeMobileMenu}
                className="flex items-center space-x-2 text-white hover:text-teal-200 transition-colors duration-200 py-2"
              >
                <BookOpen size="18px" />
                <span>Articles</span>
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-teal-500 pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center text-white space-x-2 py-2">
                      <User size="18px" />
                      <span className="text-sm">
                        {user?.first_name || user?.name || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 text-white hover:text-teal-200 transition-colors duration-200"
                    >
                      <LogOut size="18px" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block text-white hover:text-teal-200 transition-colors duration-200 py-2 text-right"
                  >
                    Login | Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default NewMainLayout;
