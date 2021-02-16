import * as React from "react";
import { v4 as uuidV4 } from "uuid";
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

import { addWireJoint } from "@/actions/wire-joint-add";
import { moveWireJoint, moveWireJointEnd } from "@/actions/wire-joint-move";
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
  const addedJointRef = React.useRef<string | null>(null);

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
      const jointId = uuidV4();
      addedJointRef.current = jointId;
      dispatch(addWireJoint(connectionId, startJointId, p, jointId));
    },
    [connectionId, startJointId, getMouseCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const jointId = addedJointRef.current;
      if (!jointId) {
        return;
      }
      const p = getMouseCoords(e);
      dispatch(moveWireJoint(jointId, p));
    },
    [getMouseCoords]
  );

  const onDragEnd = React.useCallback(() => {
    dispatch(moveWireJointEnd());
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
      startTracking(e);
    },
    [startTracking]
  );

  let insertJointPos: Point | undefined;
  if (mousePos) {
    let lineDir = normalize(pointSubtract(end, start));
    const v = pointSubtract(mousePos, start);
    var d = dotProduct(v, lineDir);
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
