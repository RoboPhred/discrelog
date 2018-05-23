export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  p1: Position;
  p2: Position;
}

export interface IDMap<T> {
  [key: string]: T;
}
