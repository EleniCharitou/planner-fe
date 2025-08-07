import { useState } from "react";
import TripModal from "../components/trip-planning/TripModal";
import { TripData } from "../types";
import KanbanBoard from "../components/KanbanBoard";

const Trip = () => {
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState<TripData>();
  const [showKanban, setShowKanban] = useState(false);

  const calculateTripDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference + 1;
  };

  const createColumnsInDatabase = async (
    tripId: number,
    startDate: string,
    numberOfDays: number
  ) => {
    try {
      const columns = [];

      // Create backlog column
      const backlogResponse = await fetch("http://localhost:8000/api/column/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          title: "🎯 Attractions to Visit",
          position: 0,
        }),
      });

      if (backlogResponse.ok) {
        const backlogColumn = await backlogResponse.json();
        columns.push(backlogColumn);
      }

      // Create day columns
      const start = new Date(startDate);
      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        const formattedDate = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        const dayResponse = await fetch("http://localhost:8000/api/column/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trip_id: tripId,
            title: `Day ${i + 1} - ${formattedDate}`,
            position: i + 1,
          }),
        });

        if (dayResponse.ok) {
          const dayColumn = await dayResponse.json();
          columns.push(dayColumn);
        }
      }

      return columns;
    } catch (error) {
      console.error("Error creating columns:", error);
      return [];
    }
  };

  const handleFormSubmit = async (tripInfo: TripData) => {
    try {
      const response = await fetch("http://localhost:8000/api/trip/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: tripInfo.destination,
          trip_members: tripInfo.trip_members,
          start_date: tripInfo.start_date,
          start_time: tripInfo.start_time,
          end_date: tripInfo.end_date,
          end_time: tripInfo.end_time,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create trip");
      }

      const newTrip = await response.json();
      setTripInfo(newTrip);

      // Create columns in database
      const numberOfDays = calculateTripDays(
        tripInfo.start_date,
        tripInfo.end_date
      );
      const columns = await createColumnsInDatabase(
        newTrip.id,
        tripInfo.start_date,
        numberOfDays
      );

      // Store trip data for KanbanBoard
      localStorage.setItem("currentTripId", newTrip.id.toString());
      localStorage.setItem("tripInfo", JSON.stringify(newTrip));
      localStorage.setItem("tripColumns", JSON.stringify(columns));

      setShowKanban(true);
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setShowModal(false);
    }
  };

  if (showModal) {
    return (
      <TripModal
        onSubmit={handleFormSubmit}
        onClose={() => setShowModal(false)}
      />
    );
  }

  if (showKanban && tripInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-teal-300 to-teal-600">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-amber-500/20"></div>
          <div className="relative p-8 bg-white/95 backdrop-blur-sm shadow-2xl border-b border-teal-200">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-teal-700 bg-clip-text text-transparent mb-3">
                    ✈️ Trip to {tripInfo.destination}
                  </h1>
                  <div className="flex flex-wrap items-center gap-6 text-teal-700">
                    <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200">
                      <span className="text-teal-600">📅</span>
                      <span className="font-medium">
                        {tripInfo.start_date.slice(0, 10)} →{" "}
                        {tripInfo.end_date.slice(0, 10)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                      <span className="text-amber-600">👥</span>
                      <span className="font-medium">
                        {tripInfo.trip_members.length} member
                        {tripInfo.trip_members.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tripInfo.trip_members.map((member, index) => (
                      <span
                        key={index}
                        className="relative group inline-block px-3 py-1 bg-amber-50 text-teal-800 rounded-full text-sm 
                                   font-medium border border-teal-200 mx-1 hover:cursor-pointer"
                      >
                        {member.name}
                        {member.email && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max px-2 py-1 text-xs bg-white
                                         text-black border border-teal-300 rounded-lg shadow-lg opacity-0 hover:cursor-pointer 
                                         group-hover:opacity-100 transition-opacity duration-200 z-10"
                          >
                            {member.email}
                          </div>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowKanban(false);
                    setTripInfo(undefined);
                    localStorage.removeItem("currentTripId");
                    localStorage.removeItem("tripColumns");
                    localStorage.removeItem("tripInfo");
                  }}
                  className="px-4 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl
                           hover:from-teal-600 hover:to-teal-700 transition-all duration-300 
                           transform hover:scale-105 hover:shadow-lg font-semibold
                           border border-teal-400 hover:border-teal-500 hover:cursor-pointer"
                >
                  ✈️ Plan New Trip
                </button>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-2xl p-4 border border-teal-200">
                <p className="text-teal-800 font-medium text-center">
                  🎯 Organize your trip by dragging the attractions from day to
                  day.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Board Container */}
        <div className="p-8">
          <div className="max-w-[80%] mx-auto">
            <div className="bg-amber-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-teal-200 overflow-hidden">
              <div className="bg-teal-600 p-6">
                <h2 className="text-2xl font-bold text-white text-center flex items-center justify-center gap-3">
                  <span>🗓️</span>
                  Trip Board
                </h2>
              </div>
              <KanbanBoard />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-100 via-teal-300 to-teal-600">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold bg-amber-100 bg-clip-text text-transparent mb-4">
          ✈️ Trip Planner
        </h1>
        <p className="text-teal-700 text-xl">Organize your perfect journey</p>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="group relative text-2xl font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl p-8 shadow-2xl
                   hover:from-teal-600 hover:to-teal-700 hover:scale-110 transition-all duration-300 hover:shadow-amber-200/50 
                   hover:shadow-2xl hover:cursor-pointer"
      >
        <span className="relative flex items-center gap-3">
          <span>✨</span>
          Start planning your trip
          <span>✨</span>
        </span>
      </button>
    </div>
  );
};

export default Trip;
