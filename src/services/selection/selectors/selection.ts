import { createSelector } from "reselect";

import pick from "lodash/pick";

import { nodesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";

import { createSelectionSelector } from "../utils";
import { SelectionServiceState } from "../state";

export const selectedNodeIdsSelector = createSelectionSelector(
  (state) => state.selectedNodeIds
);

export const isNodeSelectedFromNodeIdSelector = createSelectionSelector(
  (s: SelectionServiceState, nodeId: string) =>
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
  (s: SelectionServiceState, connectionId: string) =>
    s.selectedConnectionIds.indexOf(connectionId) !== -1
);

export const selectedJointIdsSelector = createSelectionSelector(
  (state) => state.selectedJointIds
);

export const isJointSelectedFromJointIdSelector = createSelectionSelector(
  (s: SelectionServiceState, jointId: string) =>
    s.selectedJointIds.indexOf(jointId) !== -1
);
