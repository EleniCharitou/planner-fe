import { ArrowLeft, Home } from "lucide-react";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
      <div className="max-w-lg mx-auto text-center">
        {/* 404 Error */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-teal-500 opacity-20">404</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 text-lg mb-2">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 
                     bg-teal-500 hover:bg-teal-600 text-white font-semibold 
                     py-3 px-6 rounded-lg transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
          >
            <Home size="20px" />
            <span>Go to Homepage</span>
          </Link>

          <div className="block sm:inline-block sm:ml-4">
            <button
              onClick={() => globalThis.history.back()}
              className="inline-flex items-center justify-center space-x-2 
                       bg-gray-500 hover:bg-gray-600 text-white font-semibold 
                       py-3 px-6 rounded-lg transition-all duration-300 
                       transform hover:scale-105 hover:shadow-lg w-full sm:w-auto"
            >
              <ArrowLeft size="20px" />
              <span>Go Back</span>
            </button>
          </div>
        </div>
        {/* Additional Help */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? The navigation bar above can take you to:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link
              to="/program"
              className="text-teal-500 hover:text-teal-600 underline"
            >
              Plan Trip
            </Link>
            <span>•</span>
            <Link
              to="/memories"
              className="text-teal-500 hover:text-teal-600 underline"
            >
              Memories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
