import { createSelector } from "reselect";
import values from "lodash/values";

import { Rectangle, union } from "@/geometry";

import { elementRectsByIdSelector } from "./element-bounds";
import { connectionJointPositionsByJointIdSelector } from "./connections";

const MinFieldRect: Readonly<Rectangle> = Object.freeze({
  p1: {
    x: -100,
    y: -100,
  },
  p2: {
    x: 100,
    y: 100,
  },
});

export const fieldRectSelector = createSelector(
  elementRectsByIdSelector,
  connectionJointPositionsByJointIdSelector,
  (elementRectsById, jointsById) => {
    const elementRects = values(elementRectsById);
    const jointRects = values(jointsById).map((p) => ({ p1: p, p2: p }));

    return [...elementRects, ...jointRects].reduce(union, MinFieldRect);
  }
);
