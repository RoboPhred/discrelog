import { isSelectAllAction } from "@/actions/select-all";

import { elementIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/elements";
import { activeCircuitIdSelector } from "@/services/circuit-editors/selectors/editor";
import { wireJointIdsFromCircuitIdSelector } from "@/services/circuit-graph/selectors/wires";

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
  const jointIds = wireJointIdsFromCircuitIdSelector(appState, circuitId);

  return {
    ...state,
    selectedElementIds: elementIds,
    selectedJointIds: jointIds,
  };
});
