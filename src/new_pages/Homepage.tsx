import React from "react";
import { MapPin, Calendar, BookOpen, Video } from "lucide-react";

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
        <div className="grid grid-cols-4 grid-rows-3 gap-4 h-96 min-w-screen/2">
          {/* First rectangle: 2 columns, 2 rows */}
          <div className="col-span-2 row-span-2 bg-teal-500 rounded-lg shadow-lg flex p-6">
            <div className="text-white text-left">
              <h2 className="text-xl font-semibold text-left mb-2">
                Travel planner & Memory maker
              </h2>
              <ul>
                <li>1.</li>
                <li>2.</li>
                <li>3.</li>
              </ul>
            </div>
          </div>

          {/* Second rectangle: 2 columns, 1 row */}
          <div
            className="col-span-2 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center
                        hover:bg-teal-800 hover:cursor-pointer"
          >
            <div className="text-white text-left">
              <h2 className="text-xl font-semibold">Plan your trip</h2>
            </div>
          </div>

          {/* Third rectangle: 2 columns, 1 row */}
          <div className="col-span-2 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-lg font-semibold mb-1">Your trips</h2>
            </div>
          </div>

          {/* Fourth rectangle: 3 columns, 1 row */}
          <div className="col-span-3 row-span-1 bg-teal-500 rounded-lg shadow-lg flex p-6">
            <div className="text-white text-left">
              <h2 className="text-lg font-semibold">Travel trips & tricks</h2>
            </div>
          </div>

          {/* Fifth rectangle: 1 column, 1 row */}
          <div className="col-span-1 row-span-1 bg-teal-500 rounded-lg shadow-lg flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-lg font-semibold m-2 p-8">
                Generate your <br /> memory video
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
