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

export function snapValue(v: number, snap: number) {
  return Math.round(v / snap) * snap;
}
export function snapPoint(p: Point, snap: number) {
  return {
    x: snapValue(p.x, snap),
    y: snapValue(p.y, snap),
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

export function pointIntersectsRect(p: Point, r: Rectangle): boolean {
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

export function rectIntersectsRect(r1: Rectangle, r2: Rectangle): boolean {
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

export interface LinePointInterceptOpts {
  threshhold?: number;
  axialGridSnap?: number;
}

export interface LinePointInterceptResult {
  interceptPoint: Point;
  interceptLineLengthDistance: number;
  interceptLinePointDistance: number;
}
export function linePointIntercept(
  lineStart: Point,
  lineEnd: Point,
  point: Point,
  { threshhold = 4, axialGridSnap = 0 }: LinePointInterceptOpts
): LinePointInterceptResult | null {
  const lineSub = pointSubtract(lineEnd, lineStart);
  const lineLength = magnitude(lineSub);
  const lineVector = normalize(lineSub);

  if (Number.isNaN(lineVector.x) || Number.isNaN(lineVector.y)) {
    return null;
  }

  const v = pointSubtract(point, lineStart);
  const interceptDistance = dotProduct(v, lineVector);

  if (interceptDistance < 0 || interceptDistance > lineLength) {
    return null;
  }

  const interceptPoint = pointAdd(
    lineStart,
    scale(lineVector, interceptDistance)
  );

  if (axialGridSnap > 0) {
    // If snapping is enabled, snap to the axis the line follows.
    if (Math.abs(lineVector.x) === 1) {
      interceptPoint.x = snapValue(interceptPoint.x, axialGridSnap);
    }
    if (Math.abs(lineVector.y) === 1) {
      interceptPoint.y = snapValue(interceptPoint.y, axialGridSnap);
    }
  }

  const lineToDotDist = magnitude(pointSubtract(point, interceptPoint));
  if (lineToDotDist > threshhold) {
    return null;
  }

  return {
    interceptPoint,
    // Point may have snapped, recalculate distance
    interceptLineLengthDistance: magnitude(
      pointSubtract(interceptPoint, lineStart)
    ),
    interceptLinePointDistance: lineToDotDist,
  };
}
