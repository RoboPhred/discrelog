import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers, getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { elementTypeFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeStateFromNodeIdSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { nodePositionFromNodeIdSelector } from "@/services/field/selectors/node-positions";

import { fieldDragStartNode } from "@/actions/field-drag-start-node";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { interactNode } from "@/actions/node-interact";
import { selectNodes } from "@/actions/select-nodes";

import ElementVisual from "@/pages/CircuitEditor/components/ElementVisual";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

export interface CircuitNodeProps {
  nodeId: string;
}

const CircuitNode: React.FC<CircuitNodeProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const { x, y } = useSelector((s) =>
    nodePositionFromNodeIdSelector(s, nodeId)
  );
  const nodeType = useSelector((s) => elementTypeFromNodeIdSelector(s, nodeId));
  const nodeState = useSelector((s) => nodeStateFromNodeIdSelector(s, nodeId));
  const isSelected = useSelector((s) =>
    isNodeSelectedFromNodeIdSelector(s, nodeId)
  );

  const getCoords = useEventMouseCoords();

  const onClick = React.useCallback((e: MouseEvent) => {
    const modifiers = getModifiers(e);
    if (modifiers.altKey) {
      dispatch(interactNode(nodeId));
    } else {
      const mode = getSelectMode(modifiers);
      dispatch(selectNodes(nodeId, mode));
    }
  }, []);

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(fieldDragStartNode(nodeId, p, mode));
    },
    [nodeId, getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      dispatch(fieldDragContinue(p));
    },
    [getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(fieldDragEnd(p, mode));
    },
    [getCoords]
  );

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd,
  });
  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      startTracking(e);
    },
    [getCoords]
  );

  if (!nodeType) {
    return null;
  }

  return (
    <ElementVisual
      x={x}
      y={y}
      elementType={nodeType}
      nodeState={nodeState}
      // TODO: Use css vars for this.  Currently cannot do so as nodes declare their own
      //  stroke/fill that gets set as attributes
      colorOverride={isSelected ? "blue" : undefined}
      onMouseDown={onMouseDown}
    />
  );
};

export default CircuitNode;
