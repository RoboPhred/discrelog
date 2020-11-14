import { createSelector } from "reselect";
import getBounds from "svg-path-bounds";

import mapValues from "lodash/mapValues";

import { normalizeVisuals } from "@/node-defs/utils";
import { normalizeRectangle } from "@/geometry";

import { nodeDefsByNodeIdSelector } from "@/services/graph/selectors/nodes";
import { nodeStatesByIdSelector } from "@/services/simulator/selectors/nodes";

import { createFieldSelector } from "../utils";

import { nodePositionsByNodeIdSelector } from "./positions";

export const fieldWidthSelector = createFieldSelector((s) => s.width);
export const fieldHeightSelector = createFieldSelector((s) => s.height);

export const nodeBoundsByIdSelector = createSelector(
  nodeDefsByNodeIdSelector,
  nodeStatesByIdSelector,
  (nodeDefsById, nodeStateById) =>
    mapValues(nodeDefsById, (x, id) => {
      if (x.visual.hitPath) {
        return getBounds(x.visual.hitPath);
      }
      const shapePaths = normalizeVisuals(
        x.visual.shapePath,
        nodeStateById[id]
      );
      if (shapePaths.length > 0) {
        return getBounds(shapePaths[0].path);
      }
      return [0, 0, 0, 0];
    })
);

export const nodeRectsByIdSelector = createSelector(
  nodePositionsByNodeIdSelector,
  nodeBoundsByIdSelector,
  (positionsById, boundsById) =>
    mapValues(positionsById, (p1, id) => {
      const bounds = boundsById[id] || [0, 0, 0, 0];
      return normalizeRectangle(
        {
          x: p1.x + bounds[0],
          y: p1.y + bounds[1],
        },
        {
          x: p1.x + bounds[2],
          y: p1.y + bounds[3],
        }
      );
    })
);
