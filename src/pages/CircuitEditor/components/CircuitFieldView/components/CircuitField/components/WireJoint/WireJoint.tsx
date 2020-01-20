import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/types";
import { cls } from "@/utils";
import { getSelectMode, getModifiers } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { wireJointPositionFromJointIdSelector } from "@/services/field/selectors/wires";
import { isJointSelectedFromJointIdSelector } from "@/services/selection/selectors/selection";

import { moveWireJoint } from "@/actions/wire-joint-move";
import { selectWireJoints } from "@/actions/select-wire-joints";

import { useEventMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./WireJoint.module.css";

interface WireJointProps {
  jointId: string;
}

const WireJoint: React.FC<WireJointProps> = ({ jointId }) => {
  const getMouseCoords = useEventMouseCoords();
  const dispatch = useDispatch();

  const isSelected = useSelector(state =>
    isJointSelectedFromJointIdSelector(state, jointId)
  );

  const position = useSelector(state =>
    wireJointPositionFromJointIdSelector(state, jointId)
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

  return (
    <circle
      className={cls(styles["wire-joint"], isSelected && styles["selected"])}
      cx={position.x}
      cy={position.y}
      r={mouseOver || isSelected ? 4 : 2}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseDown={mouseDown}
    />
  );
};

export default WireJoint;
