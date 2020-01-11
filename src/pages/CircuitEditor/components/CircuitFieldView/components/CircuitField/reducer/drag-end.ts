import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";

import { isDragEndAction } from "../actions/drag-end";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isDragEndAction(action)) {
    return state;
  }

  const { x, y, selectionMode } = action.payload;

  let circuitField = state.ui.circuitEditor.circuitField;

  const { dragMode, dragStart } = circuitField;

  if (dragStart) {
    switch (dragMode) {
      case "select": {
        const rect = normalizeRectangle(dragStart, { x, y });
        state = rootReducer(state, selectRegion(rect, selectionMode));
        break;
      }
      case "move": {
        const moveBy = pointSubtract({ x, y }, dragStart);
        state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
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
