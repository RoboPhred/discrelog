import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/types";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { wireJointPositionSelector } from "@/services/field/selectors/wires";
import { isJointSelectedSelector } from "@/services/selection/selectors/selection";

import { moveWireJoint } from "@/actions/wire-joint-move";
import { selectWireJoints } from "@/actions/select-wire-joints";

import { useEventMouseCoords } from "../hooks/useMouseCoords";
import { getSelectMode, getModifiers } from "../selection-mode";

interface WireJointProps {
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = ({ jointId }) => {
  const getMouseCoords = useEventMouseCoords();
  const dispatch = useDispatch();

  const isSelected = useSelector(state =>
    isJointSelectedSelector(state, jointId)
  );

  const position = useSelector(state =>
    wireJointPositionSelector(state, jointId)
  );
  const [mouseOver, setMouseOver] = React.useState(false);

  const onJointDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      dispatch(moveWireJoint(jointId, p));
    },
    [getMouseCoords]
  );

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(selectWireJoints(jointId, mode));
    },
    [jointId]
  );

  const { startTracking: startMoveJointTracking } = useMouseTracking({
    onClick,
    onDragMove: onJointDragMove
  });

  const onMouseOver = React.useCallback(() => {
    setMouseOver(true);
  }, []);
  const onMouseOut = React.useCallback(() => {
    setMouseOver(false);
  }, []);

  const mouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      startMoveJointTracking(e);
    },
    [startMoveJointTracking]
  );

  let color: string;
  if (isSelected) {
    color = "yellow";
  } else {
    color = "black";
  }

  return (
    <circle
      cx={position.x}
      cy={position.y}
      r={mouseOver ? 3 : 2}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseDown={mouseDown}
      fill={color}
    />
  );
};

export default WireJoint;
