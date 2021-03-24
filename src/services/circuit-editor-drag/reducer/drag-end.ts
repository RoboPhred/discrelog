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

import { circuitIdForEditorIdSelector } from "@/services/circuit-editors/selectors/editor";
import { pinIsWiredSelector } from "@/services/circuit-graph/selectors/wires";
import { pinDirectionFromElementPinSelector } from "@/services/circuit-graph/selectors/pins";

import {
  applyGridJointSnapSelector,
  applyGridElementSnapSelector,
} from "../selectors/snap";

import { defaultCircuitEditorDragServiceState } from "../state";
import { dragWireEndTargetByPointSelector } from "../selectors/drag-wire";
import {
  CircuitEditorDragWirePinTarget,
  CircuitEditorDragWireSegmentTarget,
} from "../types";

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

    // Check that we can connect to this pin.
    // We need to check here, as these operations create joints,
    // and the graph service cannot bail without having the layout service
    // still create a joint.
    // FIXME: Consider moving layout into graph so we do not have to make this check.
    const pinDirection = pinDirectionFromElementPinSelector(
      state,
      pin.elementId,
      pin.pinId
    );
    if (
      pinDirection === "input" &&
      pinIsWiredSelector(state, pin.elementId, pin.pinId)
    ) {
      return state;
    }

    // Target is now a floating or segment insertion point.  We need to insert a joint for it.
    switch (target.type) {
      case "floating":
        return rootReducer(state, connectPinToFloating(pin, target.point));
      case "segment":
        return rootReducer(
          state,
          connectPinToWireSegment(
            pin,
            target.wireId,
            target.segmentId,
            target.segmentSplitLength
          )
        );
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

    // Segment to segment would either bridge wires (which we currently do not support), or make a loop (which is pointless)
    if (altTarget.type === "segment") {
      return state;
    }

    // At this point, we are connecting a segment to floating.
    return rootReducer(
      state,
      connectFloatingToWireSegment(
        altTarget.point,
        segmentTarget.wireId,
        segmentTarget.segmentId,
        segmentTarget.segmentSplitLength
      )
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
