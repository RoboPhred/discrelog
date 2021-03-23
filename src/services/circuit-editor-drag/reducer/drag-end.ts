import { AnyAction } from "redux";

import { normalizeRectangle, pointSubtract } from "@/geometry";
import { fpSet } from "@/utils";
import { getSelectMode } from "@/selection-mode";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import {
  CircuitEditorDragEndAction,
  isCircuitEditorDragEndAction,
} from "@/actions/circuit-editor-drag-end";
import { selectRegion } from "@/actions/select-region";
import { moveSelection } from "@/actions/selection-move";
import { createPinToPinWire } from "@/actions/wire-create-pin-to-pin";

import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "../selectors/snap";

import { defaultCircuitEditorDragServiceState } from "../state";
import { dragWireEndTargetByPointSelector } from "../selectors/drag-wire";
import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";
import { pinIsWiredSelector } from "@/services/circuit-graph/selectors/wires";
import { wireInsertJoint } from "@/actions/wire-insert-joint";

export default function dragEndReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isCircuitEditorDragEndAction(action)) {
    return state;
  }

  state = executeDragMode(state, action);

  state = fpSet(
    state,
    "services",
    "circuitEditorDrag",
    defaultCircuitEditorDragServiceState
  );

  return state;
}

function executeDragMode(
  state: AppState,
  action: CircuitEditorDragEndAction
): AppState {
  const { dragMode } = state.services.circuitEditorDrag;

  switch (dragMode) {
    case "select":
      return executeSelectDrag(state, action);
    case "move":
      return executeMoveDrag(state, action);
    case "wire":
      return executeWireDrag(state, action);
    case "wire-segment-new-joint":
      return executeWireNewJointDrag(state, action);
  }

  return state;
}

function executeSelectDrag(
  state: AppState,
  action: CircuitEditorDragEndAction
): AppState {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "select") {
    return state;
  }

  const { dragStartEditorId, dragEndEditorId } = dragState;
  if (dragStartEditorId != dragEndEditorId) {
    return state;
  }

  const { dragModifierKeys, dragStart } = dragState;
  const { x, y } = action.payload;

  const circuitId = circuitIdForEditorIdSelector(state, dragStartEditorId);
  if (!circuitId) {
    return state;
  }

  const selectionMode = getSelectMode(dragModifierKeys);
  const rect = normalizeRectangle(dragStart, { x, y });
  return rootReducer(state, selectRegion(rect, circuitId, selectionMode));
}

function executeMoveDrag(
  state: AppState,
  action: CircuitEditorDragEndAction
): AppState {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "move") {
    return state;
  }

  const { dragStartEditorId, dragEndEditorId } = dragState;
  if (dragStartEditorId != dragEndEditorId) {
    return state;
  }

  const { dragStart, dragModifierKeys } = dragState;
  const { x, y } = action.payload;

  let moveBy = pointSubtract({ x, y }, dragStart);
  const hasElements = state.services.selection.selectedElementIds.length > 0;

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

  return rootReducer(state, moveSelection(moveBy.x, moveBy.y));
}

function executeWireDrag(
  state: AppState,
  action: CircuitEditorDragEndAction
): AppState {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "wire") {
    return state;
  }

  const { dragStartEditorId, dragEndEditorId } = dragState;
  if (dragStartEditorId != dragEndEditorId) {
    return state;
  }

  const { dragSourceTarget } = dragState;
  const { x, y } = action.payload;

  const dragEndTarget = dragWireEndTargetByPointSelector(state, { x, y });
  if (!dragEndTarget) {
    return state;
  }

  if (dragSourceTarget.type === "pin" && dragEndTarget.type === "pin") {
    const sourcePin = dragSourceTarget.pin;
    const endPin = dragEndTarget.pin;

    // Do checks to see if we can actually create the pin.
    // Ideally this would be done in the reducers, but due to seperating the layout from the graph,
    // the layout will not know to ignore the action if the graph ignores it...
    // I guess we could finally accept redux-thunk into our lives and do this check there...
    const sourceDirection = pinDirectionFromElementPinSelector(
      state,
      sourcePin.elementId,
      sourcePin.pinId
    );
    const endDirection = pinDirectionFromElementPinSelector(
      state,
      endPin.elementId,
      endPin.pinId
    );
    if (sourceDirection === endDirection) {
      return state;
    }
    const inputPin = sourceDirection === "input" ? sourcePin : endPin;
    if (pinIsWiredSelector(state, inputPin.elementId, inputPin.pinId)) {
      return state;
    }

    return rootReducer(
      state,
      createPinToPinWire(dragSourceTarget.pin, dragEndTarget.pin)
    );
  }

  // TODO: Other types of wire operations.

  return state;
}

export function executeWireNewJointDrag(
  state: AppState,
  action: CircuitEditorDragEndAction
): AppState {
  const dragState = state.services.circuitEditorDrag;
  if (dragState.dragMode !== "wire-segment-new-joint") {
    return state;
  }

  const { dragStartEditorId, dragEndEditorId } = dragState;
  if (dragStartEditorId != dragEndEditorId) {
    return state;
  }

  const { dragWireId, dragWireSegmentId } = dragState;
  const { x, y } = action.payload;

  return rootReducer(
    state,
    wireInsertJoint(dragWireId, dragWireSegmentId, { x, y })
  );
}
