import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorState = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-amber-50 flex justify-center items-center">
    <div className="text-center">
      <BookOpen size="80px" className="mx-auto text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 mb-2">
        Article Not Found
      </h2>
      <p className="text-gray-500 mb-6">{error}</p>

      <div className="mt-8 mb-12 text-center">
        <Link
          to="/articles"
          className="inline-flex items-center space-x-2 bg-teal-500 hover:bg-teal-600 
                     text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 
                     transform hover:scale-105 hover:shadow-lg"
        >
          <ArrowLeft size="20px" />
          <span>Back to 'Articles'</span>
        </Link>
      </div>
    </div>
  </div>
);
export default ErrorState;
