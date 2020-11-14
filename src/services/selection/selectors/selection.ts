import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByNodeIdSelector } from "@/services/graph/selectors/nodes";

import { createSelectionSelector } from "../utils";
import { SelectionState } from "../state";

export const selectedNodeIdsSelector = createSelectionSelector(
  (state) => state.selectedNodeIds
);

export const isNodeSelectedFromNodeIdSelector = createSelectionSelector(
  (s: SelectionState, nodeId: string) =>
    s.selectedNodeIds.indexOf(nodeId) !== -1
);

export const selectedNodesByIdSelector = createSelector(
  nodesByNodeIdSelector,
  selectedNodeIdsSelector,
  (nodesById, selectedNodeIds) => pick(nodesById, selectedNodeIds)
);

export const selectedWireIdsSelector = createSelectionSelector(
  (state) => state.selectedWireIds
);

export const isWireSelectedSelector = createSelectionSelector(
  (s: SelectionState, wireId: string) =>
    s.selectedWireIds.indexOf(wireId) !== -1
);

export const selectedJointIdsSelector = createSelectionSelector(
  (state) => state.selectedJointIds
);

export const isJointSelectedFromJointIdSelector = createSelectionSelector(
  (s: SelectionState, jointId: string) =>
    s.selectedJointIds.indexOf(jointId) !== -1
);
