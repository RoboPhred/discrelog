import flatten from "lodash/flatten";

import { isSelectAllAction } from "@/actions/select-all";

import {
  connectionIdsSelector,
  connectionsByIdSelector,
} from "@/services/element-graph/selectors/connections";
import { wireJointIdsByConnectionIdSelector } from "@/services/element-layout/selectors/wires";
import { elementIdsFromCircuitIdSelector } from "@/services/circuits/selectors/elements";
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

  const elementIds = elementIdsFromCircuitIdSelector(appState, circuitId);

  let connectionIds = connectionIdsSelector(appState);
  const connectionsById = connectionsByIdSelector(appState);
  connectionIds = connectionIds.filter((connectionId) => {
    const { inputPin, outputPin } = connectionsById[connectionId];
    if (
      elementIds.indexOf(inputPin.elementId) === -1 ||
      elementIds.indexOf(outputPin.elementId) === -1
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
    selectedElementIds: elementIds,
    selectedConnectionIds: connectionIds,
    selectedJointIds: jointIds,
  };
});
