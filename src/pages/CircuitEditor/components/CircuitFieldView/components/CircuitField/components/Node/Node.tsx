import * as React from "react";
import { useDispatch } from "react-redux";

import { Point, ZeroPoint } from "@/geometry";
import { getModifiers } from "@/modifier-keys";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { nodeTypeFromNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodeStateFromNodeIdSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { nodePositionFromNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { isSimActiveSelector } from "@/services/simulator/selectors/run";

import { fieldDragStartNode } from "@/actions/field-drag-start-node";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { interactNode } from "@/actions/node-interact";
import { selectNodes } from "@/actions/select-nodes";

import NodeVisual from "../NodeVisual";

import { useEventMouseCoords } from "../../hooks/useMouseCoords";

import "./Node.module.css";
import { getSelectMode } from "@/selection-mode";

export interface NodeProps {
  nodeId: string;
}

const Node: React.FC<NodeProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const isSimActive = useSelector(isSimActiveSelector);

  const pos = useSelector((s) => nodePositionFromNodeIdSelector(s, nodeId));
  if (!pos) {
    // Caught some bad logic that was rendering non-existant nodes.
    // Leaving this in for safty, although the underlying issue was fixed.
    console.warn(`Rendering node id ${nodeId} that has no position.`);
  }
  const { x, y } = pos ?? ZeroPoint;

  const nodeType = useSelector((s) => nodeTypeFromNodeIdSelector(s, nodeId));
  const nodeState = useSelector((s) => nodeStateFromNodeIdSelector(s, nodeId));
  const isSelected = useSelector((s) =>
    isNodeSelectedFromNodeIdSelector(s, nodeId)
  );

  const getCoords = useEventMouseCoords();

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (e.button !== 0) {
        return;
      }

      if (isSimActive) {
        dispatch(interactNode(nodeId));
      } else {
        const modifiers = getModifiers(e);
        const selectionMode = getSelectMode(modifiers);
        dispatch(selectNodes(nodeId, selectionMode));
      }
    },
    [isSimActive]
  );

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragStartNode(nodeId, p, modifiers));
    },
    [nodeId, getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
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
      if (e.button !== 0) {
        return;
      }

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
    <NodeVisual
      className="circuit-field-node"
      x={x}
      y={y}
      nodeType={nodeType}
      nodeState={nodeState}
      isSelected={isSelected}
      onMouseDown={onMouseDown}
    />
  );
};

export default Node;
