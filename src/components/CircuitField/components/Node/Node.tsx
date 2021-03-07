import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { Point, Rectangle, ZeroPoint } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";
import useMouseTracking from "@/hooks/useMouseTracking";

import { nodeStateFromCircuitNodeIdSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { nodePositionFromNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { editingCircuitNodeIdPathSelector } from "@/services/circuit-editor-ui-viewport/selectors/circuit";
import { nodeDefFromNodeIdSelector } from "@/services/node-graph/selectors/node-def";
import { viewScaleSelector } from "@/services/circuit-editor-ui-viewport/selectors/view";
import { nodeFieldDisplayNameFromNodeId } from "@/services/circuit-editor-ui-settings/selectors/node-name";

import { fieldDragStartNode } from "@/actions/field-drag-start-node";
import { fieldDragContinue } from "@/actions/field-drag-continue";
import { fieldDragEnd } from "@/actions/field-drag-end";
import { selectNodes } from "@/actions/select-nodes";

import { useContextMenu } from "@/components/ContextMenu";

import { useEventMouseCoords } from "../../hooks/useMouseCoords";

import NodeContextMenu from "../NodeContextMenu";

import "./Node.module.css";

export interface NodeProps {
  nodeId: string;
}

const Node: React.FC<NodeProps> = React.memo(function Node({ nodeId }) {
  const dispatch = useDispatch();

  const isSimActive = useSelector(isSimActiveSelector);
  const editCircuitIdPath = useSelector(editingCircuitNodeIdPathSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const def = useSelector((state) => nodeDefFromNodeIdSelector(state, nodeId));
  const { x, y } = useSelector((s) =>
    nodePositionFromNodeIdSelector(s, nodeId)
  );
  const nodeState = useSelector((s) =>
    nodeStateFromCircuitNodeIdSelector(s, [...editCircuitIdPath, nodeId])
  );
  const isSelected = useSelector((s) =>
    isNodeSelectedFromNodeIdSelector(s, nodeId)
  );

  const getCoords = useEventMouseCoords();

  const onClick = React.useCallback(
    (e: MouseEvent) => {
      if (isSimActive) {
        return;
      }

      if (e.defaultPrevented) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      e.preventDefault();

      const modifiers = getModifiers(e);
      const selectionMode = getSelectMode(modifiers);
      dispatch(selectNodes(nodeId, selectionMode));
    },
    [dispatch, isSimActive, nodeId]
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      const modifiers = getModifiers(e);
      const selectionMode = getSelectMode(modifiers, "set-if-unselected");
      dispatch(selectNodes(nodeId, selectionMode));
      openContextMenu(e);
    },
    [dispatch, nodeId, openContextMenu]
  );

  const onDragStart = React.useCallback(
    (e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragStartNode(nodeId, p, modifiers));
    },
    [getCoords, dispatch, nodeId]
  );

  const onDragMove = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifierKeys = getModifiers(e);
      dispatch(fieldDragContinue(p, modifierKeys));
    },
    [dispatch, getCoords]
  );

  const onDragEnd = React.useCallback(
    (offset: Point, e: MouseEvent) => {
      const p = getCoords(e);
      const modifiers = getModifiers(e);
      dispatch(fieldDragEnd(p, modifiers));
    },
    [dispatch, getCoords]
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
    [startTracking]
  );

  if (!def) {
    return null;
  }

  let body: React.ReactNode;
  let rect: Rectangle;
  if (!def) {
    body = (
      <rect
        x={x}
        y={y}
        width={50}
        height={50}
        fill={isSelected ? "goldenrod" : "red"}
      />
    );
    rect = { p1: ZeroPoint, p2: { x: 50, y: 50 } };
  } else {
    const { component: ElementComponent, hitRect } = def.visual;
    body = <ElementComponent circuitNodeId={nodeId} elementState={nodeState} />;
    rect = hitRect;
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g transform={transform}>
      <g
        className={cls("circuit-field-node", isSelected && "node-selected")}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
      >
        {body}
      </g>
      <NodeName nodeId={nodeId} hitRect={rect} />
      {renderContextMenu(<NodeContextMenu nodeId={nodeId} />)}
    </g>
  );
});

interface NodeNameProps extends NodeProps {
  hitRect: Rectangle;
}
const NodeName: React.FC<NodeNameProps> = React.memo(function NodeName({
  nodeId,
  hitRect,
}) {
  const scale = useSelector(viewScaleSelector);
  const nodeName = useSelector((s) =>
    nodeFieldDisplayNameFromNodeId(s, nodeId)
  );

  // FIXME: This is really rough, especially the y offset.
  // There is a noticable jump in position between >1 and >1 scale.
  const textScale = Math.max(0.7, scale);
  let textYOffset = 15;
  if (textScale > 1) {
    textYOffset -= textScale * 2;
  } else {
    textYOffset += (1 / textScale) * 7;
  }

  if (!nodeName) {
    return null;
  }

  return (
    <text
      fontSize={`${1.2 / textScale}em`}
      className={interaction["text-unselectable"]}
      textAnchor="middle"
      x={hitRect.p1.x + (hitRect.p2.x - hitRect.p1.x) / 2}
      y={hitRect.p2.y + textYOffset}
    >
      {nodeName}
    </text>
  );
});

export default Node;
