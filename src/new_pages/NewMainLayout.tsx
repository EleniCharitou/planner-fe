import { Link, Outlet } from "react-router-dom";
import { MdCardTravel, MdOutlineModeOfTravel } from "react-icons/md";
import { BookOpen, Calendar, LogOut, User, Video } from "lucide-react";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

function NewMainLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-teal-600 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <Link
              to="/"
              className="flex items-center space-x-2 text-white font-bold text-xl"
            >
              <MdCardTravel size="30px" />
              <span>Trip Planner</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              <Link
                to="/"
                className="text-bold text-lg text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Home</span>
              </Link>

              <Link
                to="/program"
                className="text-bold text-lg text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <MdOutlineModeOfTravel size="18px" />
                <span>Plan Trip</span>
              </Link>

              <Link
                to="/during"
                className="text-bold text-lg text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <Calendar size="18px" />
                <span>Trips</span>
              </Link>

              <Link
                to="/memories"
                className="text-bold text-lg text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <Video size="18px" />
                <span>Memories</span>
              </Link>

              <Link
                to="/articles"
                className="text-bold text-lg text-white hover:text-teal-800 transition-colors duration-200 flex items-center space-x-1"
              >
                <BookOpen size="18px" />
                <span>Articles</span>
              </Link>
            </div>

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

            {/* Mobile menu button (later) */}
            <div className="md:hidden">
              <button className="text-white">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default NewMainLayout;
