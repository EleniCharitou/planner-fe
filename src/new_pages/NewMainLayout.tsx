import { Link, Outlet } from "react-router-dom";
import Homepage from "./Homepage";
import { MdCardTravel, MdOutlineModeOfTravel } from "react-icons/md";
import { BookOpen, Calendar, Video } from "lucide-react";

function NewMainLayout() {
  return (
    <div className="min-h-screen bg-amber-50">
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
                className="text-white hover:text-amber-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <span>Home</span>
              </Link>

              <Link
                to="/program"
                className="text-white hover:text-amber-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <MdOutlineModeOfTravel size="18px" />
                <span>Plan Trip</span>
              </Link>

              <Link
                to="/memories"
                className="text-white hover:text-amber-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <Calendar size="18px" />
                <span>Memories</span>
              </Link>

              <Link
                to="/during"
                className="text-white hover:text-amber-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <Video size="18px" />
                <span>During Trip</span>
              </Link>

              <Link
                to="/add-blog"
                className="text-white hover:text-amber-200 transition-colors duration-200 flex items-center space-x-1"
              >
                <BookOpen size="18px" />
                <span>Add Blog</span>
              </Link>
            </div>

            {/* Mobile menu button ((you can add mobile menu )later) */}
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

      {/* Main content area */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default NewMainLayout;
