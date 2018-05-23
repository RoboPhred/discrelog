import { Position, Size, Rectangle } from "@/types";

export function normalizeRectangle(p1: Position, p2: Position): Rectangle;
export function normalizeRectangle(r: Rectangle): Rectangle;
export function normalizeRectangle(...args: any[]): Rectangle {
  let p1: Position;
  let p2: Position;
  if (args.length === 1) {
    const r = args[0] as Rectangle;
    (p1 = r.p1), (p2 = r.p2);
  } else {
    p1 = args[0] as Position;
    p2 = args[1] as Position;
  }
  return {
    p1: {
      x: Math.min(p1.x, p2.x),
      y: Math.min(p1.y, p2.y)
    },
    p2: {
      x: Math.max(p1.x, p2.x),
      y: Math.max(p1.y, p2.y)
    }
  };
}

export function calcSize(r: Rectangle): Size {
  r = normalizeRectangle(r);
  return {
    width: r.p2.x - r.p1.x,
    height: r.p2.y - r.p1.y
  };
}

export function intersects(r1: Rectangle, r2: Rectangle) {
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
