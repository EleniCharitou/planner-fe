export interface BlogDetails {
  id: number;
  title: string;
  content: string;
  slug: string;
  author: string;
  author_username?: string;
  picture: string | null;
  created_at?: string;
}

export interface ColumnData {
  id: string;
  title: string;
  cards: AttractionsDetails[];
}

export interface AttractionsDetails {
  id: string;
  column_id: string;
  title: string;
  location: string;
  category:
    | "museum"
    | "landmark"
    | "park"
    | "palace"
    | "restaurant"
    | "gallery"
    | "church"
    | "other";
  mapUrl?: string | null;
  ticket?: string;
  date: string;
  cost: number;
  visited: boolean;
}

export type Id = string | number;
export interface Column {
  id: Id;
  title: string;
  position?: number;
  trip_id?: number;
}

export interface TripData {
  id: number;
  destination: string;
  trip_members: { name: string; email: string }[];
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
  owner?: number;
  owner_email?: string;
  duration_days?: number;
}

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}
