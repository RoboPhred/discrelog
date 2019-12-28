import { createFieldSelector } from "../utils";
import { FieldState } from "../state";

export const nodePositionsByIdSelector = createFieldSelector(
  state => state.nodePositionsById
);

export const nodePositionSelector = createFieldSelector(
  (state: FieldState, nodeId: string) => state.nodePositionsById[nodeId]
);
