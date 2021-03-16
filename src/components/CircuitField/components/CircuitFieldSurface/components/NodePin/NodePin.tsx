import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { Point } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { describeArc } from "@/svg";

import useSelector from "@/hooks/useSelector";
import usePointerTracking from "@/hooks/usePointerTracking";

import { nodePinPositionFromNodePinSelector } from "@/services/node-layout/selectors/node-pin-positions";
import { pinDirectionFromNodePinSelector } from "@/services/node-graph/selectors/pins";
import { dragWireTargetPinSelector } from "@/services/circuit-editor-ui-drag/selectors/drag";

import { fieldDragStartWire } from "@/actions/field-drag-start-wire";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { fieldDragContinue } from "@/actions/field-drag-continue";

import { useEventMouseCoords } from "../../hooks/useMouseCoords";

import styles from "./NodePin.module.css";

export interface NodePinProps {
  nodeId: string;
  pinId: string;
}

const NodePin: React.FC<NodePinProps> = React.memo(function NodePin({
  nodeId,
  pinId,
}) {
  const getMouseCoords = useEventMouseCoords();
  const [highlight, setHighlight] = React.useState(false);
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
    [dispatch, getMouseCoords, nodeId, pinId]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [dispatch, getMouseCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getMouseCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
    },
    [dispatch, getMouseCoords]
  );

  const { startTracking } = usePointerTracking({
    onDragStart,
    onDragMove,
    onDragEnd,
  });

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
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
        onPointerDown={onPointerDown}
      />
    </g>
  );
});

export default NodePin;
