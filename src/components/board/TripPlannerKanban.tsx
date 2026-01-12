import { useState, useEffect } from "react";
import { AttractionsDetails, ColumnData, TripData } from "../../types";
import { useAttractions } from "./boardHooks/useAttractions";
import { useDragAndDrop } from "./boardHooks/useDragDrop";
import { KanbanBoard } from "./KanbanBoard";
import AttractionModal from "../AttractionModal";
import { deleteTrip, getUserTrips } from "../../services/tripApi";
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
  const [selectedColumnTitle, setSelectedColumnTitle] = useState<string>("");
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
        const columnsResponse = await api.get(
          `/column/?trip_id=${selectedTripId}`
        );
        setColumns(columnsResponse.data);

        const attractionsResponse = await api.get(
          `/grouped_attractions/?trip_id=${selectedTripId}`
        );

        const flatAttractions: AttractionsDetails[] = [];
        attractionsResponse.data.forEach((column: ColumnData) => {
          column.cards.forEach((card) => {
            flatAttractions.push(card);
          });
        });

        setInitialAttractions(flatAttractions);
      } catch (error) {
        console.error("Error fetching trip data:", error);
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
    const column = columns.find((c) => c.id === attraction.column_id);
    setSelectedColumnTitle(column ? column.title : "");
  };

  const handleDeleteAttraction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this attraction?")) {
      try {
        await api.delete(`/attraction/${id}/`);
        deleteAttraction(id);
      } catch (error) {
        console.error("Error deleting attraction:", error);
        alert("Failed to delete attraction");
      }
    }
  };

  const handleAddAttraction = (columnId: string) => {
    const column = columns.find((c) => c.id === columnId);
    setCreatingColumnId(columnId);
    setSelectedColumnTitle(column ? column.title : "");
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

      const attractionData: any = {
        title: newAttraction.title || "",
        location: newAttraction.location || "",
        category: newAttraction.category || "other",
        mapUrl: newAttraction.mapUrl || "",
        ticket: newAttraction.ticket || "",
        cost: newAttraction.cost ? String(newAttraction.cost) : "0.00",
        visited: newAttraction.visited || false,
        column_id: creatingColumnId,
      };

      if (formattedDate) {
        attractionData.date = formattedDate;
      }
      const response = await api.post("/attraction/", attractionData);

      setInitialAttractions([...attractions, response.data]);
      setIsCreatingAttraction(false);
      setCreatingColumnId("");
      setSelectedColumnTitle("");
    } catch (error: any) {
      console.error("Error creating attraction:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to create attraction: ${
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message
        }`
      );
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

      const updateData: any = {
        ...updatedAttraction,
        cost: updatedAttraction.cost ? String(updatedAttraction.cost) : "0.00",
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
      setSelectedColumnTitle("");
    } catch (error: any) {
      console.error("Error updating attraction:", error);
      console.error("Error response:", error.response?.data);
      alert(
        `Failed to update attraction: ${
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message
        }`
      );
      throw error;
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

        {selectedTripId ? (
          columns.length > 0 ? (
            <KanbanBoard
              columns={columns}
              attractions={attractions}
              getAttractionsByColumn={getAttractionsByColumn}
              onEdit={handleEdit}
              onDelete={handleDeleteAttraction}
              onAddAttraction={handleAddAttraction}
              dragHandlers={dragHandlers}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 mb-4">
                No columns found for this trip. Create columns to start
                organizing your attractions.
              </p>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600">
              Please select a trip to view its plan
            </p>
          </div>
        )}
      </div>

      {editingAttraction && (
        <AttractionModal
          isOpen={!!editingAttraction}
          attraction={editingAttraction}
          onSubmit={handleUpdateAttraction}
          onClose={() => {
            setEditingAttraction(null);
            setSelectedColumnTitle("");
          }}
          columnTitle={selectedColumnTitle}
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
            setSelectedColumnTitle("");
          }}
          columnTitle={selectedColumnTitle}
        />
      )}
    </div>
  );
}
