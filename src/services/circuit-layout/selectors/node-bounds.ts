import { createSelector } from "reselect";
import getBounds from "svg-path-bounds";

import mapValues from "lodash/mapValues";

import { NodeDefinitionsByType } from "@/nodes";
import { normalizeRectangle } from "@/geometry";

import { nodeStatesByIdSelector } from "@/services/simulator/selectors/nodes";
import { nodeTypesByNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";

import { nodePositionsByNodeIdSelector } from "./node-positions";

export const nodeBoundsByIdSelector = createSelector(
  nodeTypesByNodeIdSelector,
  nodeStatesByIdSelector,
  (elementTypesByNodeId, nodeStateById) =>
    mapValues(elementTypesByNodeId, (elementType, id) => {
      const def = NodeDefinitionsByType[elementType];
      if (!def) {
        return [0, 0, 0, 0];
      }

      return getBounds(def.visual.hitPath);
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
