import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { wireJointPositionFromJointIdSelector } from "@/services/node-layout/selectors/wires";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { selectWireJoints } from "@/actions/select-wire-joints";
import { circuitEditorDragStartJoint } from "@/actions/circuit-editor-drag-start-joint";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import { useMouseCoords } from "../hooks/useMouseCoords";

import WireJointVisual from "./WireJointVisual";

interface WireJointProps {
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = React.memo(function WireJoint({
  jointId,
}) {
  const { editorId } = useCircuitEditor();
  const getMouseCoords = useMouseCoords();
  const dispatch = useDispatch();
  const isSimActive = useSelector(isSimActiveSelector);

  const isSelected = useSelector((state) =>
    isJointSelectedFromJointIdSelector(state, jointId)
  );

  const position = useSelector((state) =>
    wireJointPositionFromJointIdSelector(state, jointId)
  );
  const onDragStart = React.useCallback(
    (e: MouseEvent, originalPoint: Point) => {
      const p = getMouseCoords(originalPoint);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragStartJoint(jointId, p, modifiers, editorId));
    },
    [dispatch, editorId, getMouseCoords, jointId]
  );

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(selectWireJoints(jointId, mode));
    },
    [dispatch, jointId]
  );

  const { startTracking } = useMouseDragDetector({
    onClick,
    onDragStart,
  });

  const onJointMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (isSimActive) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      startTracking(e);
    },
    [isSimActive, startTracking]
  );

  return (
    <WireJointVisual
      interactable={!isSimActive}
      selected={isSelected}
      x={position.x}
      y={position.y}
      onMouseDown={onJointMouseDown}
    />
  );
});

export default WireJoint;
