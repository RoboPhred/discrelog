import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import {
  dotProduct,
  normalize,
  Point,
  pointAdd,
  pointSubtract,
  scale,
  snapValue,
} from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import {
  endPositionForWireSegmentId,
  startPositionForWireSegmentId,
} from "@/services/circuit-graph/selectors/wire-positions";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { isDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";
import {
  segmentIsWiredSelector,
  wireSegmentPoweredSelector,
  wireSegmentTypeFromSegmentIdSelector,
} from "@/services/circuit-graph/selectors/wires";
import { gridJointSnapSelector } from "@/services/circuit-editor-drag/selectors/snap";
import { isSegmentSelectedFromSegmentIdSelector } from "@/services/selection/selectors/selection";

import { circuitEditorDragStartWireSegment } from "@/actions/circuit-editor-drag-start-wire-segment";
import { selectWireSegments } from "@/actions/select-wire-segments";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./WireSegment.module.css";

export interface WireSegmentProps {
  wireId: string;
  wireSegmentId: string;
}

const WireSegment: React.FC<WireSegmentProps> = ({ wireId, wireSegmentId }) => {
  const dispatch = useDispatch();
  const { editorId, elementIdPath } = useCircuitEditor();
  const getCoords = useMouseCoords();

  const isMouseGesturePending = React.useRef<boolean>(false);
  const [insertJointPos, setInsertJointPos] = React.useState<Point | null>(
    null
  );

  const isSimActive = useSelector(isSimActiveSelector);

  const isSelected = useSelector((state) =>
    isSegmentSelectedFromSegmentIdSelector(state, wireSegmentId)
  );
  const isPowered = useSelector((state) =>
    wireSegmentPoweredSelector(state, elementIdPath, wireSegmentId)
  );
  const isWired = useSelector((state) =>
    segmentIsWiredSelector(state, wireSegmentId)
  );

  const isDragging = useSelector(isDraggingSelector);

  const snap = useSelector(gridJointSnapSelector);

  const segmentType = useSelector((state) =>
    wireSegmentTypeFromSegmentIdSelector(state, wireSegmentId)
  );

  const startPos = useSelector((state) =>
    startPositionForWireSegmentId(state, wireSegmentId)
  );
  const endPos = useSelector((state) =>
    endPositionForWireSegmentId(state, wireSegmentId)
  );

  const onMouseMove = (e: React.MouseEvent<SVGLineElement>) => {
    if (isDragging || isSimActive || isMouseGesturePending.current) {
      return;
    }

    const modifierKeys = getModifiers(e);
    const p = getCoords({ x: e.pageX, y: e.pageY });
    const lineVector = normalize(pointSubtract(endPos, startPos));
    const v = pointSubtract(p, startPos);
    const d = dotProduct(v, lineVector);
    const dotPos = pointAdd(startPos, scale(lineVector, d));

    if (!modifierKeys.ctrlMetaKey) {
      // If snapping is enabled, snap to the axis the line follows.
      if (Math.abs(lineVector.x) === 1) {
        dotPos.x = snapValue(dotPos.x, snap);
      }
      if (Math.abs(lineVector.y) === 1) {
        dotPos.y = snapValue(dotPos.y, snap);
      }
    }

    setInsertJointPos(dotPos);
  };

  const onMouseLeave = () => {
    if (!isMouseGesturePending.current) {
      setInsertJointPos(null);
    }
  };

  const onDragStart = React.useCallback(
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

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      isMouseGesturePending.current = false;
      setInsertJointPos(null);

      const modifierKeys = getModifiers(e);
      const selectionMode = getSelectMode(modifierKeys);
      dispatch(selectWireSegments(wireSegmentId, selectionMode));
    },
    [dispatch, wireSegmentId]
  );

  const { startTracking } = useMouseDragDetector({
    onDragStart,
    onClick,
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
      className={cls(
        styles["wire-segment"],
        !isWired && styles["unwired"],
        isSelected && styles["selected"],
        isPowered && styles["powered"]
      )}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseDown={onMouseDown}
    >
      <line
        x1={startPos.x}
        x2={endPos.x}
        y1={startPos.y}
        y2={endPos.y}
        stroke="inherit"
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
      {(segmentType === "input" || segmentType === "input-output") && (
        <circle
          cx={endPos.x}
          cy={endPos.y}
          r={2}
          stroke="none"
          fill="inherit"
        />
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
