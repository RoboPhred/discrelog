import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { describeArc } from "@/svg";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { nodePinPositionFromNodePinSelector } from "@/services/node-layout/selectors/node-pin-positions";
import { pinDirectionFromNodePinSelector } from "@/services/node-graph/selectors/pins";
import { dragDropTargetPinSelector } from "@/services/circuit-editor-drag/selectors/drag";

import { circuitEditorDragStartWire } from "@/actions/circuit-editor-drag-start-wire";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./NodePin.module.css";

export interface NodePinProps {
  nodeId: string;
  pinId: string;
}

const NodePin: React.FC<NodePinProps> = React.memo(function NodePin({
  nodeId,
  pinId,
}) {
  const getMouseCoords = useMouseCoords();
  const [highlight, setHighlight] = React.useState(false);
  const dispatch = useDispatch();

  const position = useSelector((s) =>
    nodePinPositionFromNodePinSelector(s, nodeId, pinId)
  );
  const direction = useSelector((s) =>
    pinDirectionFromNodePinSelector(s, nodeId, pinId)
  );

  const dragTargetPin = useSelector(dragDropTargetPinSelector);

  const onDragStart = React.useCallback(
    (e, originalPoint) => {
      const p = getMouseCoords(originalPoint);
      dispatch(circuitEditorDragStartWire(p, { nodeId, pinId }));
    },
    [dispatch, getMouseCoords, nodeId, pinId]
  );

  const { startTracking } = useMouseDragDetector({
    onDragStart,
  });

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      e.stopPropagation();

      startTracking(e);
    },
    [startTracking]
  );

  const onMouseEnter = React.useCallback(() => {
    setHighlight(true);
  }, []);
  const onMouseLeave = React.useCallback(() => {
    setHighlight(false);
  }, []);

  if (!position) {
    return null;
  }

  const isDragTarget =
    dragTargetPin != null &&
    dragTargetPin.nodeId === nodeId &&
    dragTargetPin.pinId === pinId;

  const { x, y } = position;

  let pinVisual: JSX.Element;

  if (direction === "input") {
    pinVisual = (
      <path
        d={describeArc(x, y, 4, -45, 225)}
        strokeWidth={2}
        className={cls(
          styles["node-pin-input"],
          isDragTarget && styles["is-drag-target"],
          highlight && styles.highlight
        )}
      />
    );
  } else {
    pinVisual = (
      <circle
        className={cls(
          styles["node-pin-output"],
          isDragTarget && styles["is-drag-target"],
          highlight && styles.highlight
        )}
        cx={x}
        cy={y}
        r={3}
      />
    );
  }

  return (
    <g onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {pinVisual}
      <circle
        stroke="none"
        fill="transparent"
        cx={x}
        cy={y}
        r={5}
        onMouseDown={onMouseDown}
      />
    </g>
  );
});

export default NodePin;
