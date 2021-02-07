import { createSelector } from "reselect";
import getBounds from "svg-path-bounds";

import mapValues from "lodash/mapValues";

import { normalizeRectangle } from "@/geometry";

import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeDefinitionsByTypeSelector } from "@/services/node-types/selectors/node-types";

import { nodePositionsByNodeIdSelector } from "./node-positions";

export const nodeBoundsByIdSelector = createSelector(
  nodeDefinitionsByTypeSelector,
  nodeTypesByNodeIdSelector,
  (nodeDefsByType, elementTypesByNodeId) =>
    mapValues(elementTypesByNodeId, (elementType, id) => {
      const def = nodeDefsByType[elementType];
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
