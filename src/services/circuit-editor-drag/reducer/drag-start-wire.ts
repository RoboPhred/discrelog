import { AppState } from "@/store";

import { isCircuitEditorDragStartWireAction } from "@/actions/circuit-editor-drag-start-wire";
import { elementIdsByCircuitIdSelector } from "@/services/circuits/selectors/elements";

import { createCircuitEditorDragReducer } from "../utils";

export default createCircuitEditorDragReducer((state, action, rootState) => {
  if (!isCircuitEditorDragStartWireAction(action)) {
    return state;
  }

  const { x, y, pin, editorId } = action.payload;

  const circuitId = circuitIdForElement(pin.elementId, rootState);
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

function circuitIdForElement(elementId: string, state: AppState) {
  const elementIdsByCircuit = elementIdsByCircuitIdSelector(state);
  for (const circuitId of Object.keys(elementIdsByCircuit)) {
    if (elementIdsByCircuit[circuitId].indexOf(elementId) !== -1) {
      return circuitId;
    }
  }
  return null;
}
