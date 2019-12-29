import { createSelector } from "reselect";
import getBounds from "svg-path-bounds";

import mapValues from "lodash/mapValues";

import { normalizeVisuals } from "@/node-defs/utils";
import { normalizeRectangle } from "@/geometry";

import { nodeDefsByIdSelector } from "@/services/graph/selectors/nodes";
import { nodeStatesByIdSelector } from "@/services/simulator/selectors/nodes";

import { nodePositionsByIdSelector } from "./positions";
import { createFieldSelector } from "../utils";

export const fieldWidthSelector = createFieldSelector(s => s.width);
export const fieldHeightSelector = createFieldSelector(s => s.height);

export const nodeBoundsById = createSelector(
  nodeDefsByIdSelector,
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
  nodePositionsByIdSelector,
  nodeBoundsById,
  (positionsById, boundsById) =>
    mapValues(positionsById, (p1, id) => {
      const bounds = boundsById[id] || [0, 0, 0, 0];
      return normalizeRectangle(
        {
          x: p1.x + bounds[0],
          y: p1.y + bounds[1]
        },
        {
          x: p1.x + bounds[2],
          y: p1.y + bounds[3]
        }
      );
    })
);
