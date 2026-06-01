
export type Point = {
  id?: string;
  name?: string;
  x: number;
  y: number;
  z?: number;
  description?: string;
};

export type Line = {
  id: string;
  order: number;
  bearing: number; // in decimal degrees
  distance: number;
};

export type Loop = {
    id: string;
    name: string;
}
