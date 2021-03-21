import { createSelector } from "reselect";

import mapValues from "lodash/mapValues";

import { offsetRectangle, ZeroRect } from "@/geometry";

import { elementTypesByElementIdSelector } from "@/services/element-graph/selectors/elements";
import { elementDefinitionsByTypeSelector } from "@/services/element-types/selectors/element-types";

import { elementPositionsByElementIdSelector } from "./element-positions";

export const elementRectsByIdSelector = createSelector(
  elementPositionsByElementIdSelector,
  elementDefinitionsByTypeSelector,
  elementTypesByElementIdSelector,
  (positionsById, elementDefsByType, elementTypesById) =>
    mapValues(positionsById, (position, id) => {
      const type = elementTypesById[id];
      if (!type) {
        return ZeroRect;
      }
      const def = elementDefsByType[type];
      if (!def) {
        return ZeroRect;
      }

      return offsetRectangle(def.visual.hitRect, position);
    })
);
