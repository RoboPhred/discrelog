import { Point } from "@/geometry";

export function getFieldCoord(
  field: SVGSVGElement,
  scaler: SVGGraphicsElement,
  p: Point
) {
  const ctm = scaler.getScreenCTM();
  if (!ctm) {
    return p;
  }

  const pt = field.createSVGPoint();
  pt.x = p.x;
  pt.y = p.y;
  const translated = pt.matrixTransform(ctm.inverse());
  return { x: translated.x, y: translated.y };
}
