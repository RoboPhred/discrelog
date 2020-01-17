import * as React from "react";
import { useDispatch } from "react-redux";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { selectWires } from "@/actions/select-wires";

import {
  wireStartPositionSelector,
  wireEndPositionSelector,
  wireJointsSelector
} from "@/services/field/selectors/wires";
import { isWireSelectedSelector } from "@/services/selection/selectors/selection";
import { wireValueSelector } from "@/services/simulator/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

import WireSegment from "./WireSegment";
import WireJoint from "./WireJoint";
import { Point } from "@/types";
import { moveWireJoint } from "@/actions/wire-joint-move";
import { addWireJoint } from "@/actions/wire-joint-add";

export interface WireProps {
  wireId: string;
}

const Wire: React.FC<WireProps> = ({ wireId }) => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();

  const start = useSelector(state => wireStartPositionSelector(state, wireId));
  const end = useSelector(state => wireEndPositionSelector(state, wireId));
  const joints = useSelector(state => wireJointsSelector(state, wireId));
  const value = useSelector(state => wireValueSelector(state, wireId));
  const isSelected = useSelector(state =>
    isWireSelectedSelector(state, wireId)
  );

  const jointDraggingRef = React.useRef<number | null>(null);

  const onClick = React.useCallback(() => {
    jointDraggingRef.current = null;
    dispatch(selectWires(wireId));
  }, [wireId]);

  const onJointDragStart = React.useCallback(
    (e: MouseEvent) => {
      if (!jointDraggingRef.current) {
        return;
      }
      const p = getMouseCoords(e);
      dispatch(addWireJoint(wireId, jointDraggingRef.current, p));
    },
    [getMouseCoords]
  );

  const onJointDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      if (!jointDraggingRef.current) {
        return;
      }
      const p = getMouseCoords(e);
      dispatch(moveWireJoint(wireId, jointDraggingRef.current, p));
    },
    [getMouseCoords]
  );

  const onJointDragEnd = React.useCallback((offset: Point, e: MouseEvent) => {
    jointDraggingRef.current = null;
  }, []);

  const { startTracking: startInsertJointTracking } = useMouseTracking({
    onClick,
    onDragStart: onJointDragStart,
    onDragMove: onJointDragMove
  });

  const { startTracking: startMoveJointTracking } = useMouseTracking({
    onClick,
    onDragMove: onJointDragMove,
    onDragEnd: onJointDragEnd
  });

  const onJointMouseDown = React.useCallback(
    (jointIndex: number, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      jointDraggingRef.current = jointIndex;
      startMoveJointTracking(e);
    },
    []
  );

  const onJointInsertMouseDown = React.useCallback(
    (jointIndex: number | null, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      jointDraggingRef.current = jointIndex || joints.length;
      console.log("insert mouse down");
      startInsertJointTracking(e);
    },
    []
  );

  let color: string;
  if (isSelected) {
    color = "yellow";
  } else if (value) {
    color = "green";
  } else {
    color = "black";
  }

  const segmentEnds = [...joints, end];

  const segmentElements = segmentEnds.map((_, index) => {
    return (
      <WireSegment
        key={index}
        wireId={wireId}
        startJointIndex={index == 0 ? null : index - 1}
        endJointIndex={index < joints.length ? index : null}
        color={color}
        onJointInsertMouseDown={onJointInsertMouseDown}
      />
    );
  });

  const jointElements = joints.map((_, index) => (
    <WireJoint
      key={index}
      wireId={wireId}
      color={color}
      jointIndex={index}
      onMouseDown={onJointMouseDown}
    />
  ));

  return (
    <>
      {segmentElements}
      {jointElements}
    </>
  );
};

export default Wire;
