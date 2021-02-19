import * as React from "react";
import { useDispatch } from "react-redux";

import {
  Point,
  normalize,
  pointSubtract,
  dotProduct,
  pointAdd,
  scale,
} from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { fieldDragStartNewJoint } from "@/actions/field-drag-start-newjoint";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { selectWires } from "@/actions/select-wires";

import {
  wireJointPositionFromJointIdSelector,
  wireStartPositionFromConnectionIdSelector,
  wireEndPositionFromConnectionIdSelector,
} from "@/services/node-layout/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

export interface WireSegmentProps {
  connectionId: string;
  startJointId: string | null;
  endJointId: string | null;
}
const WireSegment: React.FC<WireSegmentProps> = ({
  connectionId,
  startJointId,
  endJointId,
}) => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();

  const start = useSelector((state) => {
    if (startJointId == null) {
      return wireStartPositionFromConnectionIdSelector(state, connectionId);
    }
    return wireJointPositionFromJointIdSelector(state, startJointId);
  });

  const end = useSelector((state) => {
    if (endJointId == null) {
      return wireEndPositionFromConnectionIdSelector(state, connectionId);
    }
    return wireJointPositionFromJointIdSelector(state, endJointId);
  });

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

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(
        fieldDragStartNewJoint(connectionId, startJointId, p, modifiers)
      );
    },
    [connectionId, startJointId, getMouseCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragContinue(p, modifiers));
    },
    [getMouseCoords]
  );

  const onDragEnd = React.useCallback((e: MouseEvent) => {
    const p = getMouseCoords(e);
    const modifiers = getModifiers(e);
    dispatch(fieldDragEnd(p, modifiers));
  }, []);

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(selectWires(connectionId, mode));
    },
    [connectionId]
  );

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
  });

  const onJointInsertMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startTracking(e);
    },
    [startTracking]
  );

  let insertJointPos: Point | undefined;
  if (mousePos) {
    const lineDir = normalize(pointSubtract(end, start));
    const v = pointSubtract(mousePos, start);
    const d = dotProduct(v, lineDir);
    insertJointPos = pointAdd(start, scale(lineDir, d));
  }

  return (
    <g onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} strokeWidth={2} />
      {insertJointPos && (
        <circle
          cx={insertJointPos.x}
          cy={insertJointPos.y}
          r={3}
          stroke="none"
          fill="red"
          onMouseDown={onJointInsertMouseDown}
        />
      )}
    </g>
  );
};

export default WireSegment;
