import * as React from "react";
import { useDispatch } from "react-redux";

import { Point } from "@/types";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { nodeTypeSelector } from "@/services/graph/selectors/nodes";
import { nodeStateSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedSelector } from "@/services/selection/selectors/selection";

import NodeVisual, {
  RenderPinProps
} from "@/pages/CircuitEditor/components/NodeVisual";

import { useEventMouseCoords } from "../hooks/useMouseCoords";

import { dragStartNode } from "../actions/drag-start-node";
import { dragContinue } from "../actions/drag-continue";
import { dragEnd } from "../actions/drag-end";

import { getModifiers, getSelectMode } from "../selection-mode";

import CircuitNodePin from "./CircuitNodePin";
import { interactNode } from "@/actions/node-interact";
import { selectNodes } from "@/actions/select-nodes";

export interface CircuitNodeProps {
  nodeId: string;
  x: number;
  y: number;
}

const CircuitNode: React.FC<CircuitNodeProps> = ({ nodeId, x, y }) => {
  const dispatch = useDispatch();

  const nodeType = useSelector(s => nodeTypeSelector(s, nodeId));
  const nodeState = useSelector(s => nodeStateSelector(s, nodeId));
  const isSelected = useSelector(s => isNodeSelectedSelector(s, nodeId));

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
      dispatch(dragStartNode(nodeId, p, mode));
    },
    [nodeId, getCoords]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      dispatch(dragContinue(p));
    },
    [getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      const mode = getSelectMode(modifiers);
      dispatch(dragEnd(p, mode));
    },
    [getCoords]
  );

  const { startTracking } = useMouseTracking({
    onClick,
    onDragStart,
    onDragMove,
    onDragEnd
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

  const renderPin = React.useCallback(
    (props: RenderPinProps) => {
      const { id, x, y } = props;
      return <CircuitNodePin key={id} nodeId={nodeId} pinId={id} x={x} y={y} />;
    },
    [nodeId]
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
      colorOverride={isSelected ? "yellow" : undefined}
      renderPin={renderPin}
      onMouseDown={onMouseDown}
    />
  );
};

export default CircuitNode;
