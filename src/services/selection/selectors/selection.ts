import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";
import { SelectionState } from "../state";

export const selectedNodeIdsSelector = createSelectionSelector(
  state => state.selectedNodeIds
);

export const isNodeSelectedSelector = createSelectionSelector(
  (s: SelectionState, nodeId: string) =>
    s.selectedNodeIds.indexOf(nodeId) !== -1
);

export const selectedNodesByIdSelector = createSelector(
  nodesByIdSelector,
  selectedNodeIdsSelector,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);

export const selectedWireIdsSelector = createSelectionSelector(
  state => state.selectedWireIds
);

export const isWireSelectedSelector = createSelectionSelector(
  (s: SelectionState, wireId: string) =>
    s.selectedWireIds.indexOf(wireId) !== -1
);
