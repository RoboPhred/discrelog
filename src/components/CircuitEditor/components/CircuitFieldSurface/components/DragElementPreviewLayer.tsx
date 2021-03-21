import * as React from "react";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createSelector } from "reselect";

import { elementTypesByElementIdSelector } from "@/services/element-graph/selectors/elements";
import { elementPositionsByElementIdSelector } from "@/services/element-layout/selectors/element-positions";
import { selectedElementIdsSelector } from "@/services/selection/selectors/selection";
import {
  dragMoveOffsetSelector,
  isEditorDraggingSelector,
} from "@/services/circuit-editor-drag/selectors/drag";

import useSelector from "@/hooks/useSelector";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ElementVisual from "./ElementVisual";

const selectedElementPositionsByIdSelector = createSelector(
  selectedElementIdsSelector,
  elementPositionsByElementIdSelector,
  (selectedElementIds, elementPositionsById) =>
    pick(elementPositionsById, selectedElementIds)
);

const selectedElementTypesByIdSelector = createSelector(
  selectedElementIdsSelector,
  elementTypesByElementIdSelector,
  (selectedElementIds, elementTypesById) =>
    pick(elementTypesById, selectedElementIds)
);

const DragElementPreviewLayer: React.FC = React.memo(
  function DragElementPreviewLayer() {
    const { editorId } = useCircuitEditor();

    const isDragging = useSelector((state) =>
      isEditorDraggingSelector(state, editorId)
    );

    const selectedElementPositionsById = useSelector(
      selectedElementPositionsByIdSelector
    );
    const selectedElementTypesById = useSelector(
      selectedElementTypesByIdSelector
    );
    const dragMoveOffset = useSelector(dragMoveOffsetSelector);

    if (!isDragging || !dragMoveOffset) {
      return null;
    }

    let elements: React.ReactNode | null = null;
    if (dragMoveOffset) {
      elements = values(
        mapValues(selectedElementPositionsById, (p, elementId) => (
          <ElementVisual
            key={elementId}
            elementType={selectedElementTypesById[elementId]}
            x={p.x + dragMoveOffset.x}
            y={p.y + dragMoveOffset.y}
          />
        ))
      );
    }
    return (
      <g id="drag-element-preview-layer" opacity={0.3}>
        {elements}
      </g>
    );
  }
);

export default DragElementPreviewLayer;
