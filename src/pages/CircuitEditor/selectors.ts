import { createSelector } from "reselect";

import getBounds from "svg-path-bounds";

import { mapValues, pick } from "lodash-es";

import { normalizeRectangle } from "@/geometry";

import { AppState } from "@/store";

import {
  nodeDefsById,
  nodeStatesById,
  nodesById
} from "@/services/simulator/selectors";
import { normalizeVisuals } from "@/services/simulator/node-types/utils";

export const nodePositionsById = (s: AppState) =>
  s.ui.circuitEditor.nodePositions;

export const nodeBoundsById = createSelector(
  nodeDefsById,
  nodeStatesById,
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

export const nodeRectsById = createSelector(
  nodePositionsById,
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

export const selectedNodeIds = (s: AppState) =>
  s.ui.circuitEditor.selectedNodeIds;

export const selectedNodesById = createSelector(
  nodesById,
  selectedNodeIds,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);
