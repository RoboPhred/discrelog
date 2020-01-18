import * as React from "react";
import uuidV4 from "uuid/v4";
import { useDispatch } from "react-redux";

import { Point } from "@/types";
import {
  normalize,
  pointSubtract,
  dotProduct,
  pointAdd,
  scale
} from "@/geometry";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { addWireJoint } from "@/actions/wire-joint-add";
import { moveWireJoint } from "@/actions/wire-joint-move";

import {
  wireJointPositionSelector,
  wireStartPositionSelector,
  wireEndPositionSelector
} from "@/services/field/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";
import { selectWires } from "@/actions/select-wires";
import { getSelectMode, getModifiers } from "../selection-mode";

export interface WireSegmentProps {
  wireId: string;
  startJointId: string | null;
  endJointId: string | null;
  color: string;
}
const WireSegment: React.FC<WireSegmentProps> = ({
  wireId,
  startJointId,
  endJointId,
  color
}) => {
  const dispatch = useDispatch();
  const getMouseCoords = useEventMouseCoords();

  const start = useSelector(state => {
    if (startJointId == null) {
      return wireStartPositionSelector(state, wireId);
    }
    return wireJointPositionSelector(state, startJointId);
  });

  const end = useSelector(state => {
    if (endJointId == null) {
      return wireEndPositionSelector(state, wireId);
    }
    return wireJointPositionSelector(state, endJointId);
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
    onDragMove
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
          onMouseDown={onJointInsertMouseDown}
        />
      )}
    </g>
  );
};

export default WireSegment;
