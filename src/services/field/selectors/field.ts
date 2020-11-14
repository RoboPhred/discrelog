import { createSelector } from "reselect";
import values from "lodash/values";

import { Rectangle } from "@/types";
import { union } from "@/geometry";

import { nodeRectsByIdSelector } from "./node-bounds";
import { wireJointPositionsByJointIdSelector } from "./wires";

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
  nodeRectsByIdSelector,
  wireJointPositionsByJointIdSelector,
  (nodeRectsById, wireJointsById) => {
    const nodeRects = values(nodeRectsById);
    const jointRects = values(wireJointsById).map((p) => ({ p1: p, p2: p }));

    return [...nodeRects, ...jointRects].reduce(union, MinFieldRect);
  }
);
