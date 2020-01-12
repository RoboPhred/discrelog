import * as React from "react";
import { useDispatch } from "react-redux";

import {
  pointAdd,
  normalize,
  pointSubtract,
  dotProduct,
  scale
} from "@/geometry";
import { Point } from "@/types";

import useSelector from "@/hooks/useSelector";

import { selectWires } from "@/actions/select-wires";

import {
  wireStartPositionSelector,
  wireEndPositionSelector,
  wireJointsSelector
} from "@/services/field/selectors/wires";
import { isWireSelectedSelector } from "@/services/selection/selectors/selection";
import { wireValueSelector } from "@/services/simulator/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";
import useMouseTracking from "@/hooks/useMouseTracking";
import { addWireJoint } from "@/actions/wire-joint-add";
import { moveWireJoint } from "@/actions/wire-joint-move";

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
    dispatch(selectWires(wireId));
  }, [wireId]);

  const onInsertJointDragStart = React.useCallback(
    (e: MouseEvent) => {
      const jointIndex = jointDraggingRef.current;
      if (jointIndex == null) {
        return;
      }

      const p = getMouseCoords(e);
      dispatch(addWireJoint(wireId, jointIndex, p));
    },
    [getMouseCoords]
  );

  const onJointDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const jointIndex = jointDraggingRef.current;
      if (jointIndex == null) {
        return;
      }

      const p = getMouseCoords(e);
      dispatch(moveWireJoint(wireId, jointIndex, p));
    },
    [getMouseCoords]
  );

  const onJointDragEnd = React.useCallback(() => {
    jointDraggingRef.current = null;
  }, []);

  const { startTracking: startInsertJointTracking } = useMouseTracking({
    onClick,
    onDragStart: onInsertJointDragStart,
    onDragMove: onJointDragMove,
    onDragEnd: onJointDragEnd
  });

  const onInsertJointMouseDown = React.useCallback(
    (jointIndex: number, e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      jointDraggingRef.current = jointIndex;
      startInsertJointTracking(e);
    },
    []
  );

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

  let color: string;
  if (isSelected) {
    color = "yellow";
  } else if (value) {
    color = "green";
  } else {
    color = "black";
  }

  const segmentEnds = [...joints, end];

  const segmentElements = segmentEnds.map((segEnd, index) => {
    const segStart = index > 0 ? segmentEnds[index - 1] : start;
    return (
      <WireSegment
        key={index}
        start={segStart}
        end={segEnd}
        jointIndex={index}
        color={color}
        onInsertJointMouseDown={onInsertJointMouseDown}
      />
    );
  });

  const jointElements = joints.map((position, index) => (
    <WireJoint
      key={index}
      position={position}
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

interface WireSegmentProps {
  start: Point;
  end: Point;
  color: string;
  jointIndex: number;
  onInsertJointMouseDown(jointIndex: number, e: React.MouseEvent): void;
}
const WireSegment: React.FC<WireSegmentProps> = ({
  start,
  end,
  color,
  jointIndex,
  onInsertJointMouseDown
}) => {
  const getMouseCoords = useEventMouseCoords();

  const [mousePos, setMousePos] = React.useState<Point | null>(null);

  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      const p = getMouseCoords(e);
      setMousePos(p);
    },
    [getMouseCoords]
  );

  const onMouseLeave = React.useCallback(() => {
    setMousePos(null);
  }, []);

  let insertJointPos: Point | undefined;
  if (mousePos) {
    let lineDir = normalize(pointSubtract(end, start));
    const v = pointSubtract(mousePos, start);
    var d = dotProduct(v, lineDir);
    insertJointPos = pointAdd(start, scale(lineDir, d));
  }

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onInsertJointMouseDown(jointIndex, e);
    },
    [jointIndex, onInsertJointMouseDown]
  );

  return (
    <g onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={color}
        strokeWidth={2}
      />
      {insertJointPos && (
        <circle
          cx={insertJointPos.x}
          cy={insertJointPos.y}
          r={3}
          fill="red"
          onMouseDown={onMouseDown}
        />
      )}
    </g>
  );
};

interface WireJointProps {
  jointIndex: number;
  position: Point;
  color: string;
  onMouseDown(jointIndex: number, e: React.MouseEvent): void;
}

const WireJoint: React.FC<WireJointProps> = ({
  jointIndex,
  position,
  color,
  onMouseDown
}) => {
  const [mouseOver, setMouseOver] = React.useState(false);

  const onMouseOver = React.useCallback(() => {
    setMouseOver(true);
  }, []);
  const onMouseOut = React.useCallback(() => {
    setMouseOver(false);
  }, []);

  const mouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onMouseDown(jointIndex, e);
    },
    [jointIndex, onMouseDown]
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

export default Wire;
