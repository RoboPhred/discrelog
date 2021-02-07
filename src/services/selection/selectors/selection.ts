import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";

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

export const selectedConnectionIdsSelector = createSelectionSelector(
  (state) => state.selectedConnectionIds
);

export const isWireSelectedFromConnectionIdSelector = createSelectionSelector(
  (s: SelectionState, connectionId: string) =>
    s.selectedConnectionIds.indexOf(connectionId) !== -1
);

export const selectedJointIdsSelector = createSelectionSelector(
  (state) => state.selectedJointIds
);

export const isJointSelectedFromJointIdSelector = createSelectionSelector(
  (s: SelectionState, jointId: string) =>
    s.selectedJointIds.indexOf(jointId) !== -1
);
