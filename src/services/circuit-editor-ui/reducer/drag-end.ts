import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragEndAction } from "@/actions/field-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";
import { addElement } from "@/actions/element-add";

import { applyGridSnapSelector } from "../selectors/snap";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragEndAction(action)) {
    return state;
  }

  const { x, y, selectionMode } = action.payload;

  const {
    dragMode,
    dragStart,
    dragEnd,
    dragNewElementType,
  } = state.services.circuitEditorUi;

  switch (dragMode) {
    case "select": {
      if (dragStart) {
        const rect = normalizeRectangle(dragStart, { x, y });
        state = rootReducer(state, selectRegion(rect, selectionMode));
      }
      break;
    }
    case "move": {
      if (dragStart) {
        let moveBy = pointSubtract({ x, y }, dragStart);
        moveBy = applyGridSnapSelector(state, moveBy);
        state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
      }
      break;
    }
    case "new-element": {
      if (dragEnd) {
        const position = applyGridSnapSelector(state, dragEnd);
        state = rootReducer(
          state,
          addElement(dragNewElementType!, { position })
        );
      }
      break;
    }
  }

  state = fpSet(state, "services", "circuitEditorUi", (value) => ({
    ...value,
    dragMode: null,
    dragStart: null,
    dragEnd: null,
    dragNewElementType: null,
  }));

  return state;
}
