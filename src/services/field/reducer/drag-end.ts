import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragEndAction } from "@/actions/field-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragEndAction(action)) {
    return state;
  }

  const { x, y, selectionMode } = action.payload;

  const { dragMode, dragStart } = state.services.field;

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

  state = fpSet(state, "services", "field", value => ({
    ...value,
    dragMode: null,
    dragStart: null,
    dragEnd: null
  }));

  return state;
}
