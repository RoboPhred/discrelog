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
import { getSelectMode, getModifiers } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { addWireJoint } from "@/actions/wire-joint-add";
import { moveWireJoint } from "@/actions/wire-joint-move";
import { selectWires } from "@/actions/select-wires";

import {
  wireJointPositionFromJointIdSelector,
  wireStartPositionFromWireIdSelector,
  wireEndPositionFromWireIdSelector,
} from "@/services/circuit-layout/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

export interface WireSegmentProps {
  wireId: string;
  startJointId: string | null;
  endJointId: string | null;
}
const WireSegment: React.FC<WireSegmentProps> = ({
  wireId,
  startJointId,
  endJointId,
}) => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();

  const start = useSelector((state) => {
    if (startJointId == null) {
      return wireStartPositionFromWireIdSelector(state, wireId);
    }
    return wireJointPositionFromJointIdSelector(state, startJointId);
  });

  const end = useSelector((state) => {
    if (endJointId == null) {
      return wireEndPositionFromWireIdSelector(state, wireId);
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
      dispatch(addWireJoint(wireId, startJointId, p, jointId));
    },
    [wireId, startJointId, getMouseCoords]
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

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(selectWires(wireId, mode));
    },
    [wireId]
  );

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragMove,
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
