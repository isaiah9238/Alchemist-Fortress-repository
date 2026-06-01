
export type Point = {
  id: string;
  x: number; // Easting or Lon
  y: number; // Northing or Lat
  z?: number;
};

export type ConversionResult = {
  id: string;
  x: number;
  y: number;
  z?: number;
};
