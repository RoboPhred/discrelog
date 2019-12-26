import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";

export const selectedNodeIdsSelector = createSelectionSelector(state => {
  if (state.selectionType === "nodes") {
    return state.selectedIds;
  }
  return [];
});

export const selectedWireIdsSelector = createSelectionSelector(state => {
  if (state.selectionType === "wires") {
    return state.selectedIds;
  }
  return [];
});

export const selectedNodesByIdSelector = createSelector(
  nodesByIdSelector,
  selectedNodeIdsSelector,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);
