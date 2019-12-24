import { createFieldSelector } from "../utils";

export const nodePositionsByIdSelector = createFieldSelector(
  state => state.nodePositionsById
);
