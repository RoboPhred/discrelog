import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";
import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isCircuitEditorDragEndAction } from "@/actions/circuit-editor-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";
import { addWireJoint } from "@/actions/wire-joint-add";
import { attachWire } from "@/actions/wire-attach";

import { elementPinFromPointSelector } from "@/services/circuit-layout/selectors/element-pin-positions";
import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "../selectors/snap";

import { defaultCircuitEditorDragServiceState } from "../state";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragEndAction(action)) {
    return state;
  }

  const dragState = state.services.circuitEditorDrag;

  if (dragState.dragMode === null) {
    return state;
  }

  const { x, y } = action.payload;

  const { dragStart, dragStartEditorId, dragEndEditorId } = dragState;

  if (dragStartEditorId != dragEndEditorId) {
    // TODO: Should allow this if dragMode is move.  Just be sure to cut the cross-circuit wires.
    state = fpSet(
      state,
      "services",
      "circuitEditorDrag",
      defaultCircuitEditorDragServiceState
    );
    return state;
  }

  switch (dragState.dragMode) {
    case "select": {
      const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
      if (circuitId) {
        const { dragModifierKeys } = dragState;
        const selectionMode = getSelectMode(dragModifierKeys);
        const rect = normalizeRectangle(dragStart, { x, y });
        state = rootReducer(
          state,
          selectRegion(rect, circuitId, selectionMode)
        );
      }
      break;
    }
    case "move": {
      const { dragModifierKeys } = dragState;
      let moveBy = pointSubtract({ x, y }, dragStart);
      const hasElements =
        state.services.selection.selectedElementIds.length > 0;
      if (!dragModifierKeys.ctrlMetaKey) {
        // We apply the snap here because we want to snap the offset, not the resulting positions.
        // Applying the snap in moveSelection can result in different objects moving different distances
        // depending on their snap.
        if (hasElements) {
          moveBy = applyGridElementSnapSelector(state, moveBy);
        } else {
          moveBy = applyGridJointSnapSelector(state, moveBy);
        }
      }
      state = rootReducer(state, moveSelection(moveBy.x, moveBy.y));
      break;
    }
    case "new-joint": {
      const { dragNewJointConnectionId, dragNewJointAfterJointId } = dragState;
      const position = applyGridJointSnapSelector(state, { x, y });
      state = rootReducer(
        state,
        addWireJoint(
          dragNewJointConnectionId!,
          dragNewJointAfterJointId,
          position
        )
      );
      break;
    }
    case "wire": {
      const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
      if (circuitId) {
        const { dragWireSource } = dragState;
        const endPin = elementPinFromPointSelector(state, { x, y }, circuitId);
        if (dragWireSource && endPin) {
          state = rootReducer(state, attachWire(dragWireSource, endPin));
        }
      }
      break;
    }
  }

  state = fpSet(
    state,
    "services",
    "circuitEditorDrag",
    defaultCircuitEditorDragServiceState
  );

  return state;
}
