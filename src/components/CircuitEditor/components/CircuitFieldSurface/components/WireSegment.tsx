import * as React from "react";
import { useDispatch } from "react-redux";

import {
  dotProduct,
  normalize,
  Point,
  pointAdd,
  pointSubtract,
  scale,
  snapPoint,
} from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import {
  endPositionByWireSegmentId,
  startPositionByWireSegmentId,
} from "@/services/circuit-graph/selectors/wire-positions";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { isDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";
import { wireSegmentTypeFromSegmentIdSelector } from "@/services/circuit-graph/selectors/wires";
import { gridJointSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";

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

  const isMouseGesturePending = React.useRef<boolean>(false);
  const [insertJointPos, setInsertJointPos] = React.useState<Point | null>(
    null
  );

  const isSimActive = useSelector(isSimActiveSelector);
  const isDragging = useSelector(isDraggingSelector);

  const snap = useSelector(gridJointSnapSelector);

  const segmentType = useSelector((state) =>
    wireSegmentTypeFromSegmentIdSelector(state, wireSegmentId)
  );

  const startPos = useSelector((state) =>
    startPositionByWireSegmentId(state, wireSegmentId)
  );
  const endPos = useSelector((state) =>
    endPositionByWireSegmentId(state, wireSegmentId)
  );

  const onMouseMove = (e: React.MouseEvent<SVGLineElement>) => {
    if (isDragging || isSimActive) {
      return;
    }

    if (!isMouseGesturePending.current) {
      const modifierKeys = getModifiers(e);
      const p = getCoords({ x: e.pageX, y: e.pageY });
      const lineDir = normalize(pointSubtract(endPos, startPos));
      const v = pointSubtract(p, startPos);
      const d = dotProduct(v, lineDir);
      const dotPos = pointAdd(startPos, scale(lineDir, d));

      if (!modifierKeys.ctrlMetaKey) {
        // If snapping is enabled, snap to the axis the line follows.
        if (Math.abs(lineDir.x) === 1) {
          dotPos.x = Math.round(dotPos.x / snap) * snap;
        }
        if (Math.abs(lineDir.y) === 1) {
          dotPos.y = Math.round(dotPos.y / snap) * snap;
        }
      }
      setInsertJointPos(dotPos);
    }
  };

  const onMouseLeave = () => {
    if (!isMouseGesturePending.current) {
      setInsertJointPos(null);
    }
  };

  const onJointDragStart = React.useCallback(
    (e: MouseEvent) => {
      isMouseGesturePending.current = false;
      if (!insertJointPos) {
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

      setInsertJointPos(null);
    },
    [dispatch, editorId, insertJointPos, wireId, wireSegmentId]
  );

  const onClick = React.useCallback(() => {
    isMouseGesturePending.current = false;
    setInsertJointPos(null);
  }, []);

  const { startTracking } = useMouseDragDetector({
    onDragStart: onJointDragStart,
    onClick: onClick,
  });

  const onMouseDown = (e: React.MouseEvent) => {
    if (e.defaultPrevented) {
      return;
    }

    if (isDragging || isSimActive) {
      return;
    }

    isMouseGesturePending.current = true;
    startTracking(e);
  };

  return (
    <g
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
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
      {segmentType === "input" && (
        <circle cx={endPos.x} cy={endPos.y} r={2} stroke="none" fill="black" />
      )}
      {insertJointPos && (
        <circle
          cx={insertJointPos.x}
          cy={insertJointPos.y}
          r={3}
          fill="orange"
          stroke="none"
        />
      )}
    </g>
  );
};

export default WireSegment;
