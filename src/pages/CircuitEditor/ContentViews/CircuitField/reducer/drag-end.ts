import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { selectRegion } from "@/pages/CircuitEditor/actions/select-region";
import { moveNodes } from "@/pages/CircuitEditor/actions/node-move";

import { isDragEndAction } from "../actions/drag-end";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isDragEndAction(action)) {
    return state;
  }

  const { x, y, selectionMode } = action.payload;

  const { selectedNodeIds } = state.ui.circuitEditor;

  let circuitField = state.ui.circuitEditor.circuitField;

  const { dragMode, dragStart } = circuitField;

  if (dragStart) {
    switch (dragMode) {
      case "select": {
        const rect = normalizeRectangle(dragStart, { x, y });
        state = rootReducer(state, selectRegion(rect, selectionMode));
        break;
      }
      case "move-node": {
        const moveBy = pointSubtract({ x, y }, dragStart);
        state = rootReducer(
          state,
          moveNodes(selectedNodeIds, moveBy.x, moveBy.y)
        );
        break;
      }
    }
  }

  circuitField = {
    ...circuitField,
    dragMode: null,
    dragStart: null,
    dragEnd: null
  };

  state = fpSet(state, "ui", "circuitEditor", "circuitField", circuitField);

  return state;
}
