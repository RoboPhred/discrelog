import * as React from "react";
import { useDispatch } from "react-redux";

import {
  dotProduct,
  normalize,
  Point,
  pointAdd,
  pointSubtract,
  scale,
} from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";

import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "@/services/circuit-layout/selectors/wires";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { isDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";
import { circuitEditorDragStartWireSegment } from "@/actions/circuit-editor-drag-start-wire-segment";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import { useMouseCoords } from "../hooks/useMouseCoords";

export interface WireSegmentProps {
  wireId: string;
  wireSegmentId: string;
}

const WireSegment: React.FC<WireSegmentProps> = ({ wireId, wireSegmentId }) => {
  const dispatch = useDispatch();
  const { editorId } = useCircuitEditor();
  const getCoords = useMouseCoords();
  const isSimActive = useSelector(isSimActiveSelector);
  const isDragging = useSelector(isDraggingSelector);

  const [mousePos, setMousePos] = React.useState<Point | null>(null);
  const startPos = useSelector((state) =>
    startPositionByWireSegmentId(state, wireSegmentId)
  );
  const endPos = useSelector((state) =>
    endPositionByWireSegmentId(state, wireSegmentId)
  );

  const onMouseMove = (e: React.MouseEvent<SVGLineElement>) => {
    const p = getCoords({ x: e.pageX, y: e.pageY });
    setMousePos(p);
  };

  const onMouseLeave = () => {
    setMousePos(null);
  };

  let insertJointPos: Point | undefined;
  let jointStartFraction: number | undefined;
  if (!isDragging && !isSimActive && mousePos) {
    const lineDir = normalize(pointSubtract(endPos, startPos));
    const v = pointSubtract(mousePos, startPos);
    jointStartFraction = dotProduct(v, lineDir);
    insertJointPos = pointAdd(startPos, scale(lineDir, jointStartFraction));
  }

  const onJointDragStart = (e: React.MouseEvent) => {
    if (insertJointPos == undefined || jointStartFraction == undefined) {
      return;
    }

    const modifierKeys = getModifiers(e);
    dispatch(
      circuitEditorDragStartWireSegment(
        insertJointPos,
        wireId,
        wireSegmentId,
        modifierKeys,
        editorId
      )
    );
  };

  return (
    <g onMouseMove={onMouseMove} onMouseLeave={onMouseLeave}>
      <line
        x1={startPos.x}
        x2={endPos.x}
        y1={startPos.y}
        y2={endPos.y}
        // TODO: Color if power is flowing in this segment and sim is active.
        // Do this with css.
        stroke="black"
        // TODO: Thicker wires when more than one input is attached
        strokeWidth={2}
      />
      <line
        x1={startPos.x}
        x2={endPos.x}
        y1={startPos.y}
        y2={endPos.y}
        stroke="transparent"
        strokeWidth={4}
      />
      {insertJointPos && (
        <circle
          cx={insertJointPos.x}
          cy={insertJointPos.y}
          r={3}
          fill="orange"
          stroke="none"
          onMouseDown={onJointDragStart}
        />
      )}
    </g>
  );
};

export default WireSegment;
