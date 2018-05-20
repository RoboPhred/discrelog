export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface IDMap<T> {
  [key: string]: T;
}
