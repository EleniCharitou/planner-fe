import { useState, useEffect } from "react";
import { AttractionsDetails, ColumnData, TripData } from "../../types";
import { useAttractions } from "./boardHooks/useAttractions";
import { useDragAndDrop } from "./boardHooks/useDragDrop";
import { KanbanBoard } from "./KanbanBoard";
import AttractionModal from "../AttractionModal";
import {
  deleteTrip,
  getFullTripDetails,
  getUserTrips,
} from "../../services/tripApi";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import { MapPin, Plus } from "lucide-react";
import TripModal from "../trip-planning/TripModal";
import { TripSelector } from "./TripSelector";

export default function TripPlannerKanban() {
  const { user, isAuthenticated } = useAuth();

  const [columns, setColumns] = useState<ColumnData[]>([]);
  const [trips, setTrips] = useState<TripData[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingAttraction, setEditingAttraction] =
    useState<AttractionsDetails | null>(null);
  const [isCreatingAttraction, setIsCreatingAttraction] = useState(false);
  const [creatingColumnId, setCreatingColumnId] = useState<string>("");
  const [isCreateTripModalOpen, setIsCreateTripModalOpen] = useState(false);

  const {
    attractions,
    setAttractions: setInitialAttractions,
    updateAttraction,
    deleteAttraction,
    moveAttraction,
    moveAttractionToColumn,
    getAttractionsByColumn,
    saveAttraction,
  } = useAttractions([]);

  const dragHandlers = useDragAndDrop({
    attractions,
    columns,
    moveAttraction,
    moveAttractionToColumn,
    onReorderEnd: async () => {
      try {
        await saveAttraction("reorder", attractions);
      } catch (error) {
        console.error("Error saving reorder:", error);
      }
    },
  });

  useEffect(() => {
    const fetchTrips = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const userTrips = await getUserTrips();
        setTrips(userTrips);

        const latestTripId = localStorage.getItem("currentTripId");
        if (
          latestTripId &&
          userTrips.some((t) => t.id === Number(latestTripId))
        ) {
          setSelectedTripId(Number(latestTripId));
          localStorage.removeItem("currentTripId");
        } else if (userTrips.length > 0) {
          setSelectedTripId(userTrips[0].id);
        }
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!selectedTripId) {
      setColumns([]);
      setInitialAttractions([]);
      return;
    }

    const fetchTripData = async () => {
      try {
        const { columns: fetchedColumns, attractions: fetchedAttractions } =
          await getFullTripDetails(selectedTripId);

        setColumns(fetchedColumns);
        setInitialAttractions(fetchedAttractions);
      } catch (error) {
        console.error("Fail to load this trip:", error);
      }
    };

    fetchTripData();
  }, [selectedTripId, setInitialAttractions]);

  const handleDeleteTrip = async (tripId: number) => {
    try {
      await deleteTrip(tripId);

      const updatedTrips = trips.filter((trip) => trip.id !== tripId);
      setTrips(updatedTrips);

      if (selectedTripId === tripId) {
        const nextTripId = updatedTrips.length > 0 ? updatedTrips[0].id : null;
        setSelectedTripId(nextTripId);
        setColumns([]);
        setInitialAttractions([]);
      }
      alert("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip. Please try again.");
    }
  };

  const handleEdit = (id: string) => {
    const attraction = attractions.find((a) => a.id === id);
    if (!attraction) return;

    setEditingAttraction(attraction);
  };

  const handleDeleteAttraction = async (id: string) => {
    try {
      await deleteAttraction(id);
    } catch (error) {
      console.error("Error deleting attraction:", error);
    }
  };

  const handleAddAttraction = (columnId: string) => {
    setCreatingColumnId(columnId);
    setIsCreatingAttraction(true);
  };

  const handleCreateAttraction = async (
    newAttraction: Partial<AttractionsDetails>
  ) => {
    try {
      let formattedDate: string | undefined = undefined;
      if (newAttraction.date && newAttraction.date.trim() !== "") {
        const dateObj = new Date(newAttraction.date);
        formattedDate = dateObj.toISOString();
      }

      const attractionData: Omit<AttractionsDetails, "id"> = {
        title: newAttraction.title || "",
        location: newAttraction.location || "",
        category: newAttraction.category || "other",
        mapUrl: newAttraction.mapUrl || "",
        ticket: newAttraction.ticket || "",
        date: newAttraction.date || "",
        cost: Number(newAttraction.cost) || 0,
        visited: newAttraction.visited || false,
        column_id: creatingColumnId,
      };

      if (formattedDate) {
        attractionData.date = formattedDate;
      }
      const response = await api.post<AttractionsDetails>(
        "/attraction/",
        attractionData
      );

      setInitialAttractions([...attractions, response.data]);
      setIsCreatingAttraction(false);
    } catch (error) {
      console.error("Error creating attraction:", error);
      alert("Failed to create attraction. Please try again.");
    }
  };

  const handleUpdateAttraction = async (
    updatedAttraction: Partial<AttractionsDetails>
  ) => {
    try {
      let formattedDate: string | undefined = updatedAttraction.date;
      if (formattedDate && formattedDate.trim() !== "") {
        if (!formattedDate.includes("T")) {
          const dateObj = new Date(formattedDate);
          formattedDate = dateObj.toISOString();
        }
      } else {
        formattedDate = undefined;
      }

      const updateData: Partial<AttractionsDetails> = {
        ...updatedAttraction,
        cost: Number(updatedAttraction.cost) || 0,
      };

      if (formattedDate) {
        updateData.date = formattedDate;
      } else {
        delete updateData.date;
      }

      await api.patch(`/attraction/${editingAttraction?.id}/`, updateData);
      updateAttraction({
        ...editingAttraction!,
        ...updatedAttraction,
      } as AttractionsDetails);
      setEditingAttraction(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("Error updating attraction:", message);
      alert(`Failed to update attraction: ${message}`);
    }
  };

  const handleTripCreated = (newTrip: TripData) => {
    setTrips((prev) => [...prev, newTrip]);
    setSelectedTripId(newTrip.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-teal-300 to-teal-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-teal-300 to-teal-600">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your trips
          </p>
          <a
            href="/login"
            className="inline-block px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-300 to-teal-600 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Welcome, {user?.name || user?.email}! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              You don't have any trips yet. Create your first trip to start
              planning your adventure!
            </p>
            <button
              onClick={() => setIsCreateTripModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Plus size={20} />
              Create Your First Trip
            </button>

            <TripModal
              isOpen={isCreateTripModalOpen}
              onClose={() => setIsCreateTripModalOpen(false)}
              onSuccess={handleTripCreated}
            />
          </div>
        </div>
      </div>
    );
  }

  let boardContent;

  if (!selectedTripId) {
    boardContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600">
          Please select a trip to view and manage its plan.
        </p>
      </div>
    );
  } else if (columns.length === 0) {
    boardContent = (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600 mb-4">
          No columns found for this trip. Create columns to start organizing
          your attractions.
        </p>
      </div>
    );
  } else {
    boardContent = (
      <KanbanBoard
        columns={columns}
        attractions={attractions}
        getAttractionsByColumn={getAttractionsByColumn}
        onEdit={handleEdit}
        onDelete={handleDeleteAttraction}
        onAddAttraction={handleAddAttraction}
        dragHandlers={dragHandlers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-300 to-teal-600">
      <div className="p-6">
        <TripSelector
          trips={trips}
          selectedTripId={selectedTripId}
          onTripSelect={setSelectedTripId}
          onCreateTrip={() => setIsCreateTripModalOpen(true)}
          onTripDelete={handleDeleteTrip}
        />

        <div className="mt-6">{boardContent}</div>
      </div>

      {editingAttraction && (
        <AttractionModal
          isOpen={!!editingAttraction}
          attraction={editingAttraction}
          onSubmit={handleUpdateAttraction}
          onClose={() => {
            setEditingAttraction(null);
          }}
        />
      )}

      {isCreatingAttraction && (
        <AttractionModal
          isOpen={isCreatingAttraction}
          attraction={null}
          onSubmit={handleCreateAttraction}
          onClose={() => {
            setIsCreatingAttraction(false);
            setCreatingColumnId("");
          }}
        />
      )}
    </div>
  );
}
