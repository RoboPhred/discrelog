import { ZeroPoint } from "@/geometry";

import { createElementLayoutSelector } from "../utils";
import { ElementLayoutServiceState } from "../state";

export const elementPositionsByElementIdSelector = createElementLayoutSelector(
  (state) => state.elementPositionsById
);

export const elementPositionFromElementIdSelector = createElementLayoutSelector(
  (state: ElementLayoutServiceState, elementId: string) =>
    state.elementPositionsById[elementId] ?? ZeroPoint
);
