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
import { addWireJoint } from "@/actions/wire-joint-add";
import { attachWire } from "@/actions/wire-attach";

import {
  applyGridJointSnapSelector,
  applyGridNodeSnapSelector,
} from "../selectors/snap";
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
    dragNewJointAfterJointId,
    dragNewJointConnectionId,
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
        const hasNodes = state.services.selection.selectedNodeIds.length > 0;
        if (!modifierKeys.ctrlMetaKey) {
          // We apply the snap here because we want to snap the offset, not the resulting positions.
          // Applying the snap in moveSelection can result in different objects moving different distances
          // depending on their snap.
          if (hasNodes) {
            moveBy = applyGridNodeSnapSelector(state, moveBy);
          } else {
            moveBy = applyGridJointSnapSelector(state, moveBy);
          }
        }
        state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
      }
      break;
    }
    case "new-node": {
      if (dragEnd) {
        const position = applyGridNodeSnapSelector(state, dragEnd);
        state = rootReducer(state, addNode(dragNewNodeType!, { position }));
      }
      break;
    }
    case "new-joint": {
      if (dragEnd) {
        const position = applyGridJointSnapSelector(state, dragEnd);
        state = rootReducer(
          state,
          addWireJoint(
            dragNewJointConnectionId!,
            dragNewJointAfterJointId,
            position
          )
        );
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
