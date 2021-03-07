import * as yup from "yup";

export interface Point {
  x: number;
  y: number;
}
export const pointSchema = yup.object().shape({
  x: yup.number().required(),
  y: yup.number().required(),
});

export interface Size {
  width: number;
  height: number;
}

export interface Rectangle {
  p1: Point;
  p2: Point;
}

// Bit silly to have two ways of tracking a rectangular region, but this is inherited from svg-path-bounds
export type Bounds = [left: number, top: number, right: number, bottom: number];

export const ZeroPoint = Object.freeze({ x: 0, y: 0 });
export const ZeroRect = Object.freeze({ p1: ZeroPoint, p2: ZeroPoint });

export function boundsToRect(bounds: Bounds): Rectangle {
  return {
    p1: { x: bounds[0], y: bounds[1] },
    p2: { x: bounds[2], y: bounds[3] },
  };
}

export function snapPoint(p: Point, snap: number) {
  return {
    x: Math.round(p.x / snap) * snap,
    y: Math.round(p.y / snap) * snap,
  };
}

export function magnitude(v: Point): number {
  return Math.sqrt(v.x * v.x + v.y * v.y);
}
export function normalize(p: Point): Point {
  const m = magnitude(p);
  return {
    x: p.x / m,
    y: p.y / m,
  };
}

export function dotProduct(a: Point, b: Point): number {
  return a.x * b.x + a.y * b.y;
}

export function scale(p: Point, scaler: number) {
  return { x: p.x * scaler, y: p.y * scaler };
}

export function normalizeRectangle(p1: Point, p2: Point): Rectangle;
export function normalizeRectangle(r: Rectangle): Rectangle;
export function normalizeRectangle(...args: any[]): Rectangle {
  let p1: Point;
  let p2: Point;
  if (args.length === 1) {
    const r = args[0] as Rectangle;
    p1 = r.p1;
    p2 = r.p2;
  } else {
    p1 = args[0] as Point;
    p2 = args[1] as Point;
  }
  return {
    p1: {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y),
    },
    p2: {
      x: Math.max(p1.x, p2.x),
      y: Math.max(p1.y, p2.y),
    },
  };
}

export function offsetRectangle(rect: Rectangle, offset: Point) {
  return {
    p1: pointAdd(rect.p1, offset),
    p2: pointAdd(rect.p2, offset),
  };
}

export function pointAdd(p1: Point, p2: Point): Point {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y,
  };
}
export function pointSubtract(p1: Point, p2: Point): Point {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y,
  };
}
export function pointEquals(p1: Point, p2: Point): boolean {
  return p1.x === p2.x && p1.y === p2.y;
}

export function pointIntersects(p: Point, r: Rectangle): boolean {
  r = normalizeRectangle(r);

  if (r.p1.x > p.x || r.p2.x < p.x) {
    return false;
  }

  if (r.p1.y > p.y || r.p2.y < p.y) {
    return false;
  }

  return true;
}

export function calcSize(r: Rectangle): Size {
  r = normalizeRectangle(r);
  return {
    width: r.p2.x - r.p1.x,
    height: r.p2.y - r.p1.y,
  };
}

export function union(r1: Rectangle, r2: Rectangle): Rectangle {
  r1 = normalizeRectangle(r1);
  r2 = normalizeRectangle(r2);
  return {
    p1: {
      x: Math.min(r1.p1.x, r2.p1.x),
      y: Math.min(r1.p1.y, r2.p1.y),
    },
    p2: {
      x: Math.max(r1.p2.x, r2.p2.x),
      y: Math.max(r1.p2.y, r2.p2.y),
    },
  };
}

export function intersects(r1: Rectangle, r2: Rectangle): boolean {
  r1 = normalizeRectangle(r1);
  r2 = normalizeRectangle(r2);

  // r1 starts after p2's extent, or does not reach r2's start.
  if (r1.p1.x > r2.p2.x || r1.p2.x < r2.p1.x) {
    return false;
  }

  // r1 starts after p2's extent, or does not reach r2's start.
  if (r1.p1.y > r2.p2.y || r1.p2.y < r2.p1.y) {
    return false;
  }

  return true;
}
