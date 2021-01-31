import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/geometry";
import { getModifiers, getSelectMode } from "@/selection-mode";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { nodeTypeFromNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";
import { nodeStateFromNodeIdSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { nodePositionFromNodeIdSelector } from "@/services/circuit-layout/selectors/node-positions";
import { isSimActiveSelector } from "@/services/simulator/selectors/run";

import { fieldDragStartNode } from "@/actions/field-drag-start-node";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { interactNode } from "@/actions/node-interact";
import { selectNodes } from "@/actions/select-nodes";

import NodeVisual from "./NodeVisual";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

export interface NodeProps {
  nodeId: string;
}

const Node: React.FC<NodeProps> = ({ nodeId }) => {
  const dispatch = useDispatch();

  const isSimActive = useSelector(isSimActiveSelector);

  const { x, y } = useSelector((s) =>
    nodePositionFromNodeIdSelector(s, nodeId)
  );
  const nodeType = useSelector((s) => nodeTypeFromNodeIdSelector(s, nodeId));
  const nodeState = useSelector((s) => nodeStateFromNodeIdSelector(s, nodeId));
  const isSelected = useSelector((s) =>
    isNodeSelectedFromNodeIdSelector(s, nodeId)
  );

  const getCoords = useEventMouseCoords();

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (isSimActive) {
        dispatch(interactNode(nodeId));
      } else {
        const modifiers = getModifiers(e);
        const mode = getSelectMode(modifiers);
        dispatch(selectNodes(nodeId, mode));
      }
    },
    [isSimActive]
  );

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
    <NodeVisual
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
