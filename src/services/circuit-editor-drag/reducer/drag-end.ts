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
import { connectPinToPin } from "@/actions/wire-connect-pin-to-pin";
import { connectPinToWireSegment } from "@/actions/wire-connect-pin-to-segment";
import { connectPinToFloating } from "@/actions/wire-connect-pin-to-floating";
import { wireSegmentInsertJoint } from "@/actions/wire-segment-insert-joint";
import { connectFloatingToWireSegment } from "@/actions/wire-connect-floating-to-segment";
import { connectJointToPin } from "@/actions/wire-connect-joint-to-pin";
import { connectJointToFloating } from "@/actions/wire-connect-joint-to-floating";

import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";

import { defaultCircuitEditorDragServiceState } from "../state";

import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "../selectors/snap";
import { dragWireEndTargetByPointSelector } from "../selectors/drag-wire";

import {
  CircuitEditorDragWireJointTarget,
  CircuitEditorDragWirePinTarget,
  CircuitEditorDragWireSegmentTarget,
} from "../types";
import { connectWireJointToJoint } from "@/actions/wire-connect-joint-to-joint";

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

  const { dragStartTarget } = dragState;
  const { x, y } = action.payload;
  const dragEndTarget = dragWireEndTargetByPointSelector(state, { x, y });
  if (!dragEndTarget) {
    return state;
  }

  if (dragStartTarget.type === "pin" && dragEndTarget.type === "pin") {
    // Because this is a jointless operation, the safty checks can be done
    // inside the connectPinToPin reducer.
    return rootReducer(
      state,
      connectPinToPin(dragStartTarget.pin, dragEndTarget.pin)
    );
  } else if (dragStartTarget.type === "pin" || dragEndTarget.type === "pin") {
    const pin =
      dragStartTarget.type === "pin"
        ? dragStartTarget.pin
        : (dragEndTarget as CircuitEditorDragWirePinTarget).pin;
    const target =
      dragStartTarget.type === "pin" ? dragEndTarget : dragStartTarget;

    // Target is now a floating, segment, or joint insertion point.
    switch (target.type) {
      case "floating":
        return rootReducer(state, connectPinToFloating(pin, target.point));
      case "segment":
        return rootReducer(
          state,
          connectPinToWireSegment(
            pin,
            target.segmentId,
            target.segmentSplitLength
          )
        );
      case "joint":
        return rootReducer(state, connectJointToPin(target.jointId, pin));
    }
  } else if (
    dragStartTarget.type === "segment" ||
    dragEndTarget.type === "segment"
  ) {
    const segmentTarget =
      dragStartTarget.type === "segment"
        ? dragStartTarget
        : (dragEndTarget as CircuitEditorDragWireSegmentTarget);
    const altTarget =
      dragStartTarget.type === "segment" ? dragEndTarget : dragStartTarget;

    // Segment to segment or joint would either bridge wires (which we currently do not support), or make a loop (which is pointless)
    if (altTarget.type === "segment" || altTarget.type === "joint") {
      // TODO: If wire networks are different, merge the two wire networks.
      return state;
    }

    // At this point, we are connecting a segment to floating.
    return rootReducer(
      state,
      connectFloatingToWireSegment(
        altTarget.point,
        segmentTarget.segmentId,
        segmentTarget.segmentSplitLength
      )
    );
  } else if (
    dragStartTarget.type === "joint" ||
    dragEndTarget.type === "joint"
  ) {
    const jointTarget =
      dragStartTarget.type === "joint"
        ? dragStartTarget
        : (dragEndTarget as CircuitEditorDragWireJointTarget);
    const altTarget =
      dragStartTarget.type === "joint" ? dragEndTarget : dragStartTarget;

    if (altTarget.type === "joint") {
      return rootReducer(
        state,
        connectWireJointToJoint(jointTarget.jointId, altTarget.jointId)
      );
    }

    // At this point, we are connecting a joint to floating.
    return rootReducer(
      state,
      connectJointToFloating(jointTarget.jointId, altTarget.point)
    );
  }

  // The only option left is both are floating, which is not something our ui allows.
  return state;
}

function executeWireNewJointDrag(
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
    wireSegmentInsertJoint(dragWireId, dragWireSegmentId, { x, y })
  );
}
