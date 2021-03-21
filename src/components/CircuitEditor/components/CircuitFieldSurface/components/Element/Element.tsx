import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";
import { Point, Rectangle, ZeroPoint } from "@/geometry";
import { getModifiers } from "@/modifier-keys";
import { getSelectMode } from "@/selection-mode";

import { getNodeVisualElement } from "@/elements/visuals";

import interaction from "@/styles/interaction.module.css";

import useSelector from "@/hooks/useSelector";
import { useMouseDragDetector } from "@/hooks/useMouseDragDetector";

import { evolverStateFromCircuitElementIdSelector } from "@/services/simulator/selectors/elements";
import { isElementSelectedFromElementIdSelector } from "@/services/selection/selectors/selection";
import { elementPositionFromElementIdSelector } from "@/services/element-layout/selectors/element-positions";
import { isSimActiveSelector } from "@/services/simulator-control/selectors/run";
import { elementDefinitionFromElementIdSelector } from "@/services/element-graph/selectors/element-def";
import { elementFieldDisplayNameFromElementId } from "@/services/ui-settings/selectors/element-name";

import { circuitEditorDragStartElement } from "@/actions/circuit-editor-drag-start-element";
import { selectElements } from "@/actions/select-elements";

import { useContextMenu } from "@/components/ContextMenu";

import { useCircuitEditor } from "../../../../contexts/circuit-editor-context";
import { useViewportContext } from "../../../../contexts/viewport-context";
import { getElementHtmlId } from "../../../../ids";

import { useMouseCoords } from "../../hooks/useMouseCoords";

import ElementContextMenu from "../ElementContextMenu";

import "./Element.module.css";

export interface NodeProps {
  elementId: string;
}

const Element: React.FC<NodeProps> = React.memo(function Node({ elementId }) {
  const dispatch = useDispatch();
  const { editorId, elementIdPath } = useCircuitEditor();
  const isSimActive = useSelector(isSimActiveSelector);

  const { openContextMenu, renderContextMenu } = useContextMenu();

  const def = useSelector((state) =>
    elementDefinitionFromElementIdSelector(state, elementId)
  );
  const { x, y } = useSelector((s) =>
    elementPositionFromElementIdSelector(s, elementId)
  );
  const evolverState = useSelector((s) =>
    evolverStateFromCircuitElementIdSelector(s, [...elementIdPath, elementId])
  );
  const isSelected = useSelector((s) =>
    isElementSelectedFromElementIdSelector(s, elementId)
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
      dispatch(selectElements(elementId, selectionMode));
    },
    [dispatch, isSimActive, elementId]
  );

  const onContextMenu = React.useCallback(
    (e: React.MouseEvent) => {
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();

      const modifiers = getModifiers(e);
      const selectionMode = getSelectMode(modifiers, "set-if-unselected");
      dispatch(selectElements(elementId, selectionMode));
      openContextMenu(e);
    },
    [dispatch, elementId, openContextMenu]
  );

  const onDragStart = React.useCallback(
    (e: MouseEvent, originalPoint: Point) => {
      const p = getCoords(originalPoint);
      const modifiers = getModifiers(e);
      dispatch(
        circuitEditorDragStartElement(elementId, p, modifiers, editorId)
      );
    },
    [getCoords, dispatch, elementId, editorId]
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
      elementId,
      elementIdPath,
      evolverState,
      def.visual
    );
    rect = hitRect;
  }

  const transform = x != 0 || y != 0 ? `translate(${x}, ${y})` : undefined;
  return (
    <g transform={transform}>
      <g
        id={getElementHtmlId(editorId, elementId)}
        className={cls(
          "circuit-field-element",
          isSelected && "element-selected"
        )}
        onMouseDown={onMouseDown}
        onContextMenu={onContextMenu}
      >
        {body}
      </g>
      <NodeName elementId={elementId} hitRect={rect} />
      {renderContextMenu(({ point }) => (
        <ElementContextMenu
          elementId={elementId}
          fieldPosition={getCoords(point)}
        />
      ))}
    </g>
  );
});

interface NodeNameProps extends NodeProps {
  hitRect: Rectangle;
}
const NodeName: React.FC<NodeNameProps> = React.memo(function NodeName({
  elementId,
  hitRect,
}) {
  const { zoomFactor } = useViewportContext();
  const elementName = useSelector((s) =>
    elementFieldDisplayNameFromElementId(s, elementId)
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

  if (!elementName) {
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
      {elementName}
    </text>
  );
});

export default Element;
