import { createSelector } from "reselect";
import values from "lodash/values";

import { Rectangle, union } from "@/geometry";

import { wireJointPositionByJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";

import { elementRectsByIdSelector } from "./element-bounds";

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
  wireJointPositionByJointIdSelector,
  (elementRectsById, jointsById) => {
    const elementRects = values(elementRectsById);
    const jointRects = values(jointsById).map((p) => ({ p1: p, p2: p }));

    return [...elementRects, ...jointRects].reduce(union, MinFieldRect);
  }
);
