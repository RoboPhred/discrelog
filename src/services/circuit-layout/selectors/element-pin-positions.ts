import { createSelector } from "reselect";

import { AppState } from "@/store";

import { Point, pointAdd, ZeroPoint } from "@/geometry";

import { elementTypesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementDefinitionsByTypeSelector } from "@/services/element-types/selectors/element-types";

import { elementPositionsByElementIdSelector } from "./element-positions";

export const elementPinPositionsByPinIdByElementIdSelector = createSelector(
  elementDefinitionsByTypeSelector,
  elementPositionsByElementIdSelector,
  elementTypesByElementIdSelector,
  (elementDefsByType, elementPositionsByElementId, elementTypesByElementId) => {
    const elementPinPositionsByPinIdByElementId: Record<
      string,
      Record<string, Point>
    > = {};

    const elementIds = Object.keys(elementTypesByElementId);
    for (const elementId of elementIds) {
      const elementPinPositionsByPinId: Record<string, Point> = {};
      elementPinPositionsByPinIdByElementId[
        elementId
      ] = elementPinPositionsByPinId;

      const elementPosition =
        elementPositionsByElementId[elementId] ?? ZeroPoint;

      const elementType = elementTypesByElementId[elementId];
      if (!elementType) {
        continue;
      }
      const def = elementDefsByType[elementType];
      if (!def) {
        continue;
      }

      const pinIds = Object.keys(def.pins);
      for (const pinId of pinIds) {
        const relPinPosition = def.pins[pinId];
        const pinPosition = pointAdd(elementPosition, relPinPosition);
        elementPinPositionsByPinId[pinId] = pinPosition;
      }
    }

    return elementPinPositionsByPinIdByElementId;
  }
);

export const elementPinPositionFromElementPinSelector = (
  state: AppState,
  elementId: string,
  pinId: string
) => {
  const positonsByPinIdByElementId = elementPinPositionsByPinIdByElementIdSelector(
    state
  );
  const elementPinPositions = positonsByPinIdByElementId[elementId];
  if (!elementPinPositions) {
    return ZeroPoint;
  }
  return elementPinPositions[pinId] ?? ZeroPoint;
};
