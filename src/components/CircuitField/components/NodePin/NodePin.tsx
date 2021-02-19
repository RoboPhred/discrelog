import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { nodePinPositionFromNodePinSelector } from "@/services/node-layout/selectors/node-pin-positions";
import { pinDirectionFromNodePinSelector } from "@/services/node-graph/selectors/pins";
import { dragWireTargetPinSelector } from "@/services/circuit-editor-ui/selectors/drag";

import { fieldDragStartWire } from "@/actions/field-drag-start-wire";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { fieldDragContinue } from "@/actions/field-drag-continue";

import { useEventMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./NodePin.module.css";

export interface NodePinProps {
  nodeId: string;
  pinId: string;
}

const NodePin: React.FC<NodePinProps> = ({ nodeId, pinId }) => {
  const getMouseCoords = useEventMouseCoords();
  const dispatch = useDispatch();

  const position = useSelector((s) =>
    nodePinPositionFromNodePinSelector(s, nodeId, pinId)
  );
  const direction = useSelector((s) =>
    pinDirectionFromNodePinSelector(s, nodeId, pinId)
  );

  const dragTargetPin = useSelector(dragWireTargetPinSelector);

  const onDragStart = React.useCallback(
    (e) => {
      const p = getMouseCoords(e);
      dispatch(fieldDragStartWire(p, { nodeId, pinId }));
    },
    [getMouseCoords, nodeId, pinId]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [getMouseCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
    },
    [getMouseCoords]
  );

  const { startTracking } = useMouseTracking({
    onDragStart,
    onDragMove,
    onDragEnd,
  });

  const onMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) {
      return;
    }

    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();

    e.stopPropagation();

    startTracking(e);
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
        d={describeArc(x, y, 3, -45, 225)}
        className={cls(
          styles["node-pin-input"],
          isDragTarget && styles["is-drag-target"]
        )}
      />
    );
  } else {
    pinVisual = (
      <circle
        className={cls(
          styles["node-pin-output"],
          isDragTarget && styles["is-drag-target"]
        )}
        cx={x}
        cy={y}
        r={3}
      />
    );
  }

  return (
    <g>
      {pinVisual}
      <circle
        stroke="none"
        fill="transparent"
        cx={x}
        cy={y}
        r={3}
        onMouseDown={onMouseDown}
      />
    </g>
  );
};

export default NodePin;

// Arc code from https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): Point {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}
