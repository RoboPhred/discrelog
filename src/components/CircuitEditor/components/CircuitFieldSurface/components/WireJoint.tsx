import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { wireJointPositionFromJointIdSelector } from "@/services/node-layout/selectors/wires";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { selectWireJoints } from "@/actions/select-wire-joints";
import { circuitEditorDragStartJoint } from "@/actions/circuit-editor-drag-start-joint";
import { circuitEditorDragEnd } from "@/actions/circuit-editor-drag-end";
import { circuitEditorDragContinue } from "@/actions/circuit-editor-drag-continue";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

import WireJointVisual from "./WireJointVisual";

interface WireJointProps {
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = React.memo(function WireJoint({
  jointId,
}) {
  const getMouseCoords = useEventMouseCoords();
  const dispatch = useDispatch();
  const isSimActive = useSelector(isSimActiveSelector);

  const isSelected = useSelector((state) =>
    isJointSelectedFromJointIdSelector(state, jointId)
  );

  const position = useSelector((state) =>
    wireJointPositionFromJointIdSelector(state, jointId)
  );
  const onJointDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragStartJoint(jointId, p, modifiers));
    },
    [dispatch, getMouseCoords, jointId]
  );

  const onJointDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragContinue(p, modifiers));
    },
    [dispatch, getMouseCoords]
  );

  const onJointDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragEnd(p, modifiers));
    },
    [dispatch, getMouseCoords]
  );

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(selectWireJoints(jointId, mode));
    },
    [dispatch, jointId]
  );

  const { startTracking: startMoveJointTracking } = useMouseTracking({
    onClick,
    onDragStart: onJointDragStart,
    onDragMove: onJointDragMove,
    onDragEnd: onJointDragEnd,
  });

  const mouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (isSimActive) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      startMoveJointTracking(e);
    },
    [isSimActive, startMoveJointTracking]
  );

  return (
    <WireJointVisual
      interactable={!isSimActive}
      selected={isSelected}
      x={position.x}
      y={position.y}
      onMouseDown={mouseDown}
    />
  );
});

export default WireJoint;
