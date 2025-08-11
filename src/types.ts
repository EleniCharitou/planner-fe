export interface BlogDetails {
    id: number;
    title: string;
    content: string;
    slug: string;
    author: string;
    picture?: string | null;
  }

  export interface ColumnData {
    id: string;
    title: string;
    cards: AttractionsDetails[];
  }

  export interface AttractionsDetails {
    id?: string;
    column_id: string;
    title: string;
    location: string;
    category: 'museum' | 'landmark' | 'park' | 'palace' | 'restaurant' | 'gallery' | 'church' | 'other';
    mapUrl?: string| null;
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

  export interface Task {
    id: Id,
    columnId: Id;
    content: string;
    attractionData ?: AttractionsDetails[];
  };

  export interface TripData {
    id: number;
    destination: string;
    trip_members: { name: string, email:string }[];
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
  }