import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";
import { SelectionState } from "../state";
import { stateSanitizer } from "@/store/devtool-sanitizer";

export const selectedNodeIdsSelector = createSelectionSelector(state => {
  if (state.selectionType === "nodes") {
    return state.selectedIds;
  }
  return [];
});

export const isNodeSelectedSelector = createSelectionSelector(
  (s: SelectionState, nodeId: string) => {
    if (s.selectionType !== "nodes") {
      return false;
    }
    return s.selectedIds.indexOf(nodeId) !== -1;
  }
);

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
