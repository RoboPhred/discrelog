import * as React from "react";

import { Point } from "@/types";

import { fieldSvgElementContext } from "../contexts/fieldSvgElement";
import { getFieldCoord } from "../utils";

export function useMouseCoords(): (p: Point) => Point {
  const fieldRef = React.useContext(fieldSvgElementContext);
  return React.useCallback(
    (p: Point) => {
      if (!fieldRef) {
        console.log("useMouseCoords has no ref.  Falling back");
        return p;
      }
      return getFieldCoord(fieldRef, p);
    },
    [fieldRef]
  );
}
