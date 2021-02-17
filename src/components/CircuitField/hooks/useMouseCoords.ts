import * as React from "react";

import { Point, ZeroPoint } from "@/geometry";

import { fieldSvgElementContext } from "../contexts/fieldSvgElement";
import { getFieldCoord } from "../utils";

export function useMouseCoords(): (p: Point) => Point {
  const fieldRef = React.useContext(fieldSvgElementContext);
  return React.useCallback(
    (p: Point) => {
      if (!fieldRef) {
        return p;
      }
      return getFieldCoord(fieldRef, p);
    },
    [fieldRef]
  );
}

export function useEventMouseCoords(): (
  e: MouseEvent | React.MouseEvent
) => Point {
  const fieldRef = React.useContext(fieldSvgElementContext);
  return React.useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!fieldRef) {
        return ZeroPoint;
      }
      const p: Point = {
        x: e.pageX,
        y: e.pageY,
      };
      return getFieldCoord(fieldRef, p);
    },
    [fieldRef]
  );
}
