import { ZeroPoint } from "@/geometry";

import { createCircuitLayoutSelector } from "../utils";
import { CircuitLayoutServiceState } from "../state";

export const elementPositionsByElementIdSelector = createCircuitLayoutSelector(
  (state) => state.elementPositionsById
);

export const elementPositionFromElementIdSelector = createCircuitLayoutSelector(
  (state: CircuitLayoutServiceState, elementId: string) =>
    state.elementPositionsById[elementId] ?? ZeroPoint
);
