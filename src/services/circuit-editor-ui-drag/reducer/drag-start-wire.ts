import { isFieldDragStartWireAction } from "@/actions/field-drag-start-wire";
import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";
import { AppState } from "@/store";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action, rootState) => {
  if (!isFieldDragStartWireAction(action)) {
    return state;
  }

  const { dragStart, pin } = action.payload;

  const circuitId = circuitIdForNode(pin.nodeId, rootState);
  if (!circuitId) {
    return state;
  }

  return {
    ...state,
    dragMode: "wire",
    dragCircuitId: circuitId,
    dragStart,
    dragWireSource: pin,
  };
});

function circuitIdForNode(nodeId: string, state: AppState) {
  const nodeIdsByCircuit = nodeIdsByCircuitIdSelector(state);
  for (const circuitId of Object.keys(nodeIdsByCircuit)) {
    if (nodeIdsByCircuit[circuitId].indexOf(nodeId) !== -1) {
      return circuitId;
    }
  }
  return null;
}
