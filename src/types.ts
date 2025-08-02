export interface BlogDetails {
    id: number;
    title: string;
    content: string;
    slug: string;
    author: string;
    picture: string | null;
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
    category: string;
    mapUrl: string| null;
    ticket: string;
    date: string;
    cost: number;
    visited: boolean;
  }
// new types
  export type Id = string | number;
  export interface Column {
    id: Id;
    title: string;
  }

  export interface Task {
    id: Id,
    columnId: Id;
    content: string;
  };