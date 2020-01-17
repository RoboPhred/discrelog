import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/types";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { wireJointPositionSelector } from "@/services/field/selectors/wires";
import { moveWireJoint } from "@/actions/wire-joint-move";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

interface WireJointProps {
  jointId: string;
  color: string;
  onClick(e: MouseEvent): void;
}

const WireJoint: React.FC<WireJointProps> = ({ jointId, color, onClick }) => {
  const getMouseCoords = useEventMouseCoords();
  const dispatch = useDispatch();

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
