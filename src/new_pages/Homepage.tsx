import React from "react";
import { MapPin, Calendar, BookOpen, Video } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { MdCardTravel, MdOutlineModeOfTravel } from "react-icons/md";
import BlogContainer from "../components/homepage/BlogContainer";
import { Outlet } from "react-router-dom";

function Homepage() {
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        /{/* Main content */}
        <div className="grid grid-cols-4 grid-rows-4 gap-4 min-w-screen/2">
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

          {/* Second rectangle: 2 columns, 1 row */}
          <button
            className="col-span-1 row-span-1/2 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
                        hover:bg-teal-800 hover:cursor-pointer"
          >
            <div className="text-white text-left">
              <h2 className="text-xl font-semibold">
                Plan your trip
                <MdCardTravel className="inline-flex pl-2" size="40px" />
              </h2>
            </div>
          </button>
          {/* Third rectangle: 1 column, 1 row */}
          <button
            className="col-span-1 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
          hover:bg-gray-500 hover:cursor-not-allowed"
          >
            <div className="text-white text-center">
              <h2 className="text-2xl font-semibold m-2 p-8">
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
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default Homepage;
