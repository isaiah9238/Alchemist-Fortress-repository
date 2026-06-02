// src/types/geometry.ts

export type Point = {
  id?: string;        // Optional so it works everywhere
  name?: string;      // Metadata name
  x: number;          // Easting or Lon
  y: number;          // Northing or Lat
  z?: number;         // Elevation
  description?: string;
};

export type Line = {
  id: string;
  order: number;
  bearing: number;    // in decimal degrees
  distance: number;
};

export type Loop = {
  id: string;
  name: string;
};

export type ConversionResult = {
  id: string;
  x: number;
  y: number;
  z?: number;
};