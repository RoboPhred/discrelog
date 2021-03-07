import { createSelector } from "reselect";

import mapValues from "lodash/mapValues";

import { offsetRectangle, ZeroRect } from "@/geometry";

import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeDefinitionsByTypeSelector } from "@/services/node-types/selectors/node-types";

import { nodePositionsByNodeIdSelector } from "./node-positions";

export const nodeRectsByIdSelector = createSelector(
  nodePositionsByNodeIdSelector,
  nodeDefinitionsByTypeSelector,
  nodeTypesByNodeIdSelector,
  (positionsById, nodeDefsByType, nodeTypesById) =>
    mapValues(positionsById, (position, id) => {
      const type = nodeTypesById[id];
      if (!type) {
        return ZeroRect;
      }
      const def = nodeDefsByType[type];
      if (!def) {
        return ZeroRect;
      }

      return offsetRectangle(def.visual.hitRect, position);
    })
);
