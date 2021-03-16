import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import usePointerTracking from "@/hooks/usePointerTracking";

import { wireJointPositionFromJointIdSelector } from "@/services/node-layout/selectors/wires";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";

import { selectWireJoints } from "@/actions/select-wire-joints";
import { fieldDragStartJoint } from "@/actions/field-drag-start-joint";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { fieldDragContinue } from "@/actions/field-drag-continue";

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
      dispatch(fieldDragStartJoint(jointId, p, modifiers));
    },
    [dispatch, getMouseCoords, jointId]
  );

  const onJointDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragContinue(p, modifiers));
    },
    [dispatch, getMouseCoords]
  );

  const onJointDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
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

  const { startTracking: startMoveJointTracking } = usePointerTracking({
    onClick,
    onDragStart: onJointDragStart,
    onDragMove: onJointDragMove,
    onDragEnd: onJointDragEnd,
  });

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
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
      onPointerDown={onPointerDown}
    />
  );
});

export default WireJoint;
