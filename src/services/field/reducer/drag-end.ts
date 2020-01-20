import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";

import { fpSet } from "@/utils";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragEndAction } from "@/actions/field-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";
import { addNode } from "@/actions/node-add";

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
    dragNewNodeType
  } = state.services.field;

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
        const moveBy = pointSubtract({ x, y }, dragStart);
        state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
      }
      break;
    }
    case "new-node": {
      if (dragEnd) {
        state = rootReducer(
          state,
          // We need to use dragEnd, as the end event comes from ElementTray which doesn't know our coords.
          addNode(dragNewNodeType!, { position: dragEnd })
        );
      }
      break;
    }
  }

  state = fpSet(state, "services", "field", value => ({
    ...value,
    dragMode: null,
    dragStart: null,
    dragEnd: null,
    dragNewNodeType: null
  }));

  return state;
}
