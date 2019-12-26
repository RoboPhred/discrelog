export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  p1: Point;
  p2: Point;
}

export interface IDMap<T> {
  [key: string]: T;
}

export type SelectionMode = "set" | "append" | "remove" | "toggle";
