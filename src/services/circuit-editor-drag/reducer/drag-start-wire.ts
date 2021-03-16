import { AppState } from "@/store";

import { isCircuitEditorDragStartWireAction } from "@/actions/circuit-editor-drag-start-wire";
import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";

import { createCircuitEditorUiDragReducer } from "../utils";

export default createCircuitEditorUiDragReducer((state, action, rootState) => {
  if (!isCircuitEditorDragStartWireAction(action)) {
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
    dragEnd: null,
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
