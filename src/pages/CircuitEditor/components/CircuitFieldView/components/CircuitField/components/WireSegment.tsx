import * as React from "react";

import { Point } from "@/types";
import {
  normalize,
  pointSubtract,
  dotProduct,
  pointAdd,
  scale
} from "@/geometry";

import useSelector from "@/hooks/useSelector";

import {
  wireJointPositionSelector,
  wireStartPositionSelector,
  wireEndPositionSelector
} from "@/services/field/selectors/wires";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

export interface WireSegmentProps {
  wireId: string;
  startJointIndex: number | null;
  endJointIndex: number | null;
  color: string;
  onJointInsertMouseDown(jointIndex: number | null, e: React.MouseEvent): void;
}
const WireSegment: React.FC<WireSegmentProps> = ({
  wireId,
  startJointIndex,
  endJointIndex,
  color,
  onJointInsertMouseDown
}) => {
  const getMouseCoords = useEventMouseCoords();

  const start = useSelector(state => {
    if (startJointIndex == null) {
      return wireStartPositionSelector(state, wireId);
    }
    return wireJointPositionSelector(state, wireId, startJointIndex);
  });

  const end = useSelector(state => {
    if (endJointIndex == null) {
      return wireEndPositionSelector(state, wireId);
    }
    return wireJointPositionSelector(state, wireId, endJointIndex);
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

  const onJointInsertCircleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      onJointInsertMouseDown(endJointIndex, e);
    },
    [endJointIndex, onJointInsertMouseDown]
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
          onMouseDown={onJointInsertCircleMouseDown}
        />
      )}
    </g>
  );
};

export default WireSegment;
