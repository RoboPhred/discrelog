import { AppState } from "@/store";

import { isCircuitEditorDragStartWireAction } from "@/actions/circuit-editor-drag-start-wire";
import { nodeIdsByCircuitIdSelector } from "@/services/circuits/selectors/nodes";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action, rootState) => {
  if (!isCircuitEditorDragStartWireAction(action)) {
    return state;
  }

  const { x, y, pin, editorId } = action.payload;

  const circuitId = circuitIdForNode(pin.nodeId, rootState);
  if (!circuitId) {
    return state;
  }

  return {
    ...state,
    dragMode: "wire",
    dragStart: { x, y },
    dragStartEditorId: editorId,
    dragWireSource: pin,
    dragEnd: null,
    dragEndEditorId: null,
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
