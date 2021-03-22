import flatten from "lodash/flatten";

import { isSelectAllAction } from "@/actions/select-all";

import {
  connectionIdsSelector,
  connectionsByIdSelector,
} from "@/services/circuit-graph/selectors/connections";
import { connectionJointIdsByConnectionIdSelector } from "@/services/circuit-layout/selectors/connections";
import { elementIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
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

  const connectionJointIdsFromConnectionId = connectionJointIdsByConnectionIdSelector(
    appState
  );
  const jointIds = flatten(
    connectionIds.map((connId) => connectionJointIdsFromConnectionId[connId])
  );

  return {
    ...state,
    selectedElementIds: elementIds,
    selectedConnectionIds: connectionIds,
    selectedJointIds: jointIds,
  };
});
