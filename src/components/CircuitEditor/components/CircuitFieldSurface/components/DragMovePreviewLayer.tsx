import * as React from "react";

import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { elementTypesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { isEditorDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";
import {
  dragMoveElementPositionsByIdSelector,
  dragMoveGhostLinesSelector,
  dragMoveJointPositionsByIdSelector,
} from "@/services/circuit-editor-drag/selectors/drag-move";

import useSelector from "@/hooks/useSelector";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ElementVisual from "./ElementVisual";

const DragMovePreviewLayer: React.FC = React.memo(
  function DragElementPreviewLayer() {
    const { editorId } = useCircuitEditor();

    const isDragging = useSelector((state) =>
      isEditorDraggingSelector(state, editorId)
    );

    const dragMoveElementPositionsByElementId = useSelector(
      dragMoveElementPositionsByIdSelector
    );
    const elementTypesByElementId = useSelector(
      elementTypesByElementIdSelector
    );

    const dragMoveJointPositionsByJointId = useSelector(
      dragMoveJointPositionsByIdSelector
    );

    const ghostLines = useSelector(dragMoveGhostLinesSelector);

    if (!isDragging) {
      return null;
    }

    const movingElements = values(
      mapValues(dragMoveElementPositionsByElementId, (p, elementId) => (
        <ElementVisual
          key={elementId}
          elementType={elementTypesByElementId[elementId]}
          x={p.x}
          y={p.y}
        />
      ))
    );

    const movingJoints = values(
      mapValues(dragMoveJointPositionsByJointId, (p, jointId) => (
        <circle
          key={jointId}
          cx={p.x}
          cy={p.y}
          r={2}
          stroke="none"
          fill="black"
        />
      ))
    );

    // FIXME: Get wire style and opacity from css
    const ghostLineElements = ghostLines.map(([start, end], i) => (
      <line
        key={i}
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="black"
        strokeWidth={2}
      />
    ));

    return (
      // FIXME: Get opacity from css
      <g id="drag-element-move-preview-layer" opacity={0.4}>
        {movingElements}
        {movingJoints}
        {ghostLineElements}
      </g>
    );
  }
);

export default DragMovePreviewLayer;
