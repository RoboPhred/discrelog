import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { Point, Rectangle, ZeroPoint } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import { getNodeVisualElement } from "@/nodes/visuals";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { nodeStateFromCircuitNodeIdSelector } from "@/services/simulator/selectors/nodes";
import { isNodeSelectedFromNodeIdSelector } from "@/services/selection/selectors/selection";
import { nodePositionFromNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { nodeDefFromNodeIdSelector } from "@/services/node-graph/selectors/node-def";
import { nodeFieldDisplayNameFromNodeId } from "@/services/ui-settings/selectors/node-name";

import { circuitEditorDragStartNode } from "@/actions/circuit-editor-drag-start-node";
import { selectNodes } from "@/actions/select-nodes";

import { useContextMenu } from "@/components/ContextMenu";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { useViewportContext } from "../../../../contexts/viewport-context";
import { getNodeHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import NodeContextMenu from "../NodeContextMenu";

import "./Node.module.css";

export interface NodeProps {
  nodeId: string;
}

const Node: React.FC<NodeProps> = React.memo(function Node({ nodeId }) {
  const dispatch = useDispatch();
  const { editorId, circuitNodeIdPath } = useCircuitEditor();
  const isSimActive = useSelector(isSimActiveSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const def = useSelector((state) => nodeDefFromNodeIdSelector(state, nodeId));
  const { x, y } = useSelector((s) =>
    nodePositionFromNodeIdSelector(s, nodeId)
  );
  const nodeState = useSelector((s) =>
    nodeStateFromCircuitNodeIdSelector(s, [...circuitNodeIdPath, nodeId])
  );
  const isSelected = useSelector((s) =>
    isNodeSelectedFromNodeIdSelector(s, nodeId)
  );

  const getCoords = useMouseCoords();

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
    (e: MouseEvent, originalPoint: Point) => {
      const p = getCoords(originalPoint);
      const modifiers = getModifiers(e);
      dispatch(circuitEditorDragStartNode(nodeId, p, modifiers, editorId));
    },
    [getCoords, dispatch, nodeId, editorId]
  );

  const { startTracking } = useMouseDragDetector({
    onClick,
    onDragStart,
  });

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      // Handle this regardless, to stop mosue clicks
      // selecting nearby text.
      e.preventDefault();

      if (isSimActive) {
        return;
      }

      if (e.button !== 0) {
        return;
      }

      startTracking(e);
    },
    [isSimActive, startTracking]
  );

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
    const { hitRect } = def.visual;
    body = getNodeVisualElement(
      nodeId,
      circuitNodeIdPath,
      nodeState,
      def.visual
    );
    rect = hitRect;
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g transform={transform}>
      <g
        id={getNodeHtmlId(editorId, nodeId)}
        className={cls("circuit-field-node", isSelected && "node-selected")}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
      >
        {body}
      </g>
      <NodeName nodeId={nodeId} hitRect={rect} />
      {renderContextMenu(({ point }) => (
        <NodeContextMenu nodeId={nodeId} fieldPosition={getCoords(point)} />
      ))}
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
  const { zoomFactor } = useViewportContext();
  const nodeName = useSelector((s) =>
    nodeFieldDisplayNameFromNodeId(s, nodeId)
  );

  // FIXME: This is really rough, especially the y offset.
  // There is a noticable jump in position between >1 and >1 scale.
  const textScale = Math.max(0.7, zoomFactor);
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
