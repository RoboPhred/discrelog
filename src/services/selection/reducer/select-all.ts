import flatten from "lodash/flatten";

import { isSelectAllAction } from "@/actions/select-all";

import {
  connectionIdsSelector,
  connectionsByIdSelector,
} from "@/services/node-graph/selectors/connections";
import { wireJointIdsByConnectionIdSelector } from "@/services/node-layout/selectors/wires";
import { nodeIdsFromCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { activeCircuitIdSelector } from "@/services/circuit-editors/selectors/editor";

import { createSelectionReducer } from "../utils";

export default createSelectionReducer((state, action, appState) => {
  if (!isSelectAllAction(action)) {
    return state;
  }

  const circuitId = activeCircuitIdSelector(appState);
  if (!circuitId) {
    return state;
  }

  const nodeIds = nodeIdsFromCircuitIdSelector(appState, circuitId);

  let connectionIds = connectionIdsSelector(appState);
  const connectionsById = connectionsByIdSelector(appState);
  connectionIds = connectionIds.filter((connectionId) => {
    const { inputPin, outputPin } = connectionsById[connectionId];
    if (
      nodeIds.indexOf(inputPin.nodeId) === -1 ||
      nodeIds.indexOf(outputPin.nodeId) === -1
    ) {
      return false;
    }
    return true;
  });

  const wireJointIdsFromConnectionId = wireJointIdsByConnectionIdSelector(
    appState
  );
  const jointIds = flatten(
    connectionIds.map((connId) => wireJointIdsFromConnectionId[connId])
  );

  return {
    ...state,
    selectedNodeIds: nodeIds,
    selectedConnectionIds: connectionIds,
    selectedJointIds: jointIds,
  };
});
