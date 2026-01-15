import api from "../api";
import { TripData } from "../types";

export const getUserTrips = async (): Promise<TripData[]> => {
  try {
    const response = await api.get("/trip/");
    return response.data;
  } catch (error) {
    console.error("Error fetching trips:", error);
    throw error;
  }
};

export const getTripById = async (id: number): Promise<TripData> => {
  try {
    const response = await api.get(`/trip/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip:", error);
    throw error;
  }
};

// Create a new trip (owner is automatically set on backend)
export const createTrip = async (
  tripData: Omit<TripData, "id">
): Promise<TripData> => {
  try {
    const response = await api.post("/trip/", tripData);
    return response.data;
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const updateTrip = async (
  id: number,
  tripData: Partial<TripData>
): Promise<TripData> => {
  try {
    const response = await api.patch(`/trip/${id}/`, tripData);
    return response.data;
  } catch (error) {
    console.error("Error updating trip:", error);
    throw error;
  }
};

export const deleteTrip = async (id: number): Promise<void> => {
  try {
    await api.delete(`/trip/${id}/`);
  } catch (error) {
    console.error("Error deleting trip:", error);
    throw error;
  }
};

export const getFullTripDetails = async (tripId: number) => {
  try {
    const response = await api.get(`/grouped_attractions/?trip_id=${tripId}`);
    const data = response.data;

    return {
      columns: data.map((col: any) => ({
        id: col.id,
        title: col.title,
        trip_id: col.trip_id,
      })),
      attractions: data.flatMap((column: any) => column.cards),
    };
  } catch (error) {
    console.error("Error fetching full trip details:", error);
    throw error;
  }
};
