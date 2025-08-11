import { FaLocationArrow } from "react-icons/fa";
import BlogContainer from "../components/homepage/BlogContainer";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

function Homepage() {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const handlePlanTripClick = () => {
    setIsClicked(true);
    setTimeout(() => {
      navigate("/program");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-teal-300 to-teal-400 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Main content */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 min-w-screen/2">
          {/* First rectangle: 2 columns, 2 rows */}
          <div className="col-span-3 row-span-1 bg-teal-500 rounded-lg shadow-lg flex p-6 ">
            <div className="text-white text-left">
              <h2 className="text-2xl font-semibold text-left mb-3">
                Your space to plan and track your next trip
              </h2>
              <p className="mb-4">
                Everythning in one place for your next trip planning for you and
                your friends.
              </p>
              <ul className="list-disc font-normal text-white px-4 space-y-2">
                <li>
                  Create a list with your ideas and the places you want to
                  visit.
                </li>
                <li>
                  Add extra info on each place or activity you want [location,
                  tickets, openning hours, etc.].
                </li>
                <li> Organize everything in a Kanban board.</li>
                <li>
                  Keep track of the activities you did and which of them you
                  want to do next time.
                </li>
                <li>
                  Rate every activity, add photos, write your feelings, and a
                  funny or memorable story from this trip.
                </li>
              </ul>
            </div>
          </div>

          {/* Second rectangle: 1 column, 1 row */}
          <button
            onClick={handlePlanTripClick}
            className="col-span-1 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
                        hover:bg-teal-800 hover:cursor-pointer relative overflow-visible transition-all 
                        duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl hover:shadow-teal-500/50 group"
          >
            <div
              className="absolute inset-0 bg-gradient-to-b from-yellow-100  via-teal-500  to-teal-800
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"
            ></div>
            <div className="text-white text-left relative z-10">
              <h2 className="text-xl font-semibold p-4">
                Plan your trip
                <FaLocationArrow
                  className={`inline-flex pl-2 transition-all duration-1000 ease-out
                             group-hover:translate-x-7 group-hover:-translate-y-7 group-hover:rotate-10 ${
                               isClicked
                                 ? "rotate-[360deg] opacity-0 scale-100"
                                 : ""
                             }`}
                  size="30px"
                />
              </h2>
            </div>
          </button>
          {/* Third rectangle: 1 column, 1 row */}
          <button
            className="col-span-1 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
          hover:bg-gray-500 hover:cursor-not-allowed"
          >
            <div className="text-white text-center">
              <h2 className="text-2xl font-semibold m-2 p-4">
                Generate your memory video
              </h2>
            </div>
          </button>

          {/* Fourth rectangle: 3 columns, 1 row */}
          <div className="col-span-3 row-span-1 bg-teal-500 rounded-lg shadow-lg p-4">
            <div className="text-white text-left flex flex-col">
              <h2 className="text-2xl font-semibold mb-2">Useful articles:</h2>
              <div className="flex-1">
                <BlogContainer />
              </div>
              <Link
                to="/articles"
                className="flex items-center justify-center pt-2 hover:cursor-pointer hover:text-teal-800"
              >
                Explore more articles
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Homepage;
