import { Point } from "@/types";

export function getFieldCoord(field: SVGSVGElement, p: Point) {
  const ctm = field.getScreenCTM();
  if (!ctm) {
    return p;
  }

  const pt = field.createSVGPoint();
  pt.x = p.x;
  pt.y = p.y;
  const translated = pt.matrixTransform(ctm.inverse());
  return { x: translated.x, y: translated.y };
}