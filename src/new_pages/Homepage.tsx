import React from "react";
import { MapPin, Calendar, BookOpen, Video } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { MdCardTravel, MdOutlineModeOfTravel } from "react-icons/md";

function Homepage() {
  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start mb-8">
          <div className="relative">
            {/* Travel Logo Circle */}
            <div className="w-26 h-26 rounded-full border-3 border-green-950 flex items-center justify-center relative overflow-hidden"></div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-fit min-w-screen/2">
          {/* First rectangle: 2 columns, 2 rows */}
          <div className="col-span-2 row-span-2 bg-teal-500 rounded-lg shadow-lg flex p-6">
            <div className="text-white text-left">
              <h2 className="text-2xl font-semibold text-left mb-3">
                Your space to plan and track your next trip
              </h2>
              Everythning in one place for your next trip planning for you and
              your friends.
              <ul className="list-disc font-normal text-white p-4">
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
            className="col-span-2 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
                        hover:bg-teal-800 hover:cursor-pointer"
          >
            <div className="text-white text-left">
              <h2 className="text-xl font-semibold">
                Plan your trip
                <MdCardTravel className="inline-flex pl-2" size="35px" />
              </h2>
            </div>
          </button>

          {/* Third rectangle: 2 columns, 1 row */}
          <button
            className="col-span-2 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
          hover:bg-gray-600 hover:cursor-not-allowed"
          >
            <div className="inline-flex justify-center items-center text-white text-center">
              <h2 className="text-2xl font-semibold mb-1">Your trips</h2>
            </div>
          </button>

          {/* Fourth rectangle: 3 columns, 1 row */}
          <div className="col-span-3 row-span-1 bg-teal-500 rounded-lg shadow-lg flex p-6">
            <div className="text-white text-left">
              <h2 className="text-2xl font-semibold">Travel trips & tricks</h2>
            </div>
          </div>

          {/* Fifth rectangle: 1 column, 1 row */}
          <button
            className="col-span-1 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
          hover:bg-gray-500 hover:cursor-not-allowed"
          >
            <div className="text-white text-center">
              <h2 className="text-2xl font-semibold m-2 p-8">
                Generate your <br /> memory video
              </h2>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
