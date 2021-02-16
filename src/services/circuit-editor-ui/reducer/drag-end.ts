import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";
import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isFieldDragEndAction } from "@/actions/field-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";
import { addNode } from "@/actions/node-add";
import { attachWire } from "@/actions/wire-attach";

import { applyGridSnapSelector } from "../selectors/snap";
import { dragWireTargetPinSelector } from "../selectors/drag";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isFieldDragEndAction(action)) {
    return state;
  }

  const { x, y, modifierKeys } = action.payload;

  const {
    dragMode,
    dragStart,
    dragEnd,
    dragNewNodeType,
    dragWireSource,
  } = state.services.circuitEditorUi;

  switch (dragMode) {
    case "select": {
      if (dragStart) {
        const selectionMode = getSelectMode(modifierKeys);
        const rect = normalizeRectangle(dragStart, { x, y });
        state = rootReducer(state, selectRegion(rect, selectionMode));
      }
      break;
    }
    case "move": {
      if (dragStart) {
        let moveBy = pointSubtract({ x, y }, dragStart);
        if (!modifierKeys.ctrlMetaKey) {
          moveBy = applyGridSnapSelector(state, moveBy);
        }
        state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
      }
      break;
    }
    case "new-node": {
      if (dragEnd) {
        const position = applyGridSnapSelector(state, dragEnd);
        state = rootReducer(state, addNode(dragNewNodeType!, { position }));
      }
      break;
    }
    case "wire": {
      const endPin = dragWireTargetPinSelector(state);
      if (dragWireSource && dragEnd && endPin) {
        state = rootReducer(state, attachWire(dragWireSource, endPin));
      }
      break;
    }
  }

  state = fpSet(state, "services", "circuitEditorUi", (value) => ({
    ...value,
    dragMode: null,
    dragModifierKeys: null,
    dragStart: null,
    dragEnd: null,
    dragNewNodeType: null,
    dragWireSource: null,
  }));

  return state;
}
