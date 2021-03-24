import * as React from "react";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createSelector } from "reselect";

import { elementTypesByElementIdSelector } from "@/services/circuit-graph/selectors/elements";
import { elementPositionsByElementIdSelector } from "@/services/circuit-layout/selectors/element-positions";
import {
  selectedElementIdsSelector,
  selectedJointIdsSelector,
} from "@/services/selection/selectors/selection";
import { isEditorDraggingSelector } from "@/services/circuit-editor-drag/selectors/drag";
import { dragMoveOffsetSelector } from "@/services/circuit-editor-drag/selectors/drag-move";

import useSelector from "@/hooks/useSelector";

import { useCircuitEditor } from "../../../contexts/circuit-editor-context";

import ElementVisual from "./ElementVisual";
import { wireJointPositionByJointIdSelector } from "@/services/circuit-graph/selectors/wire-positions";

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

const selectedJointPositionsByIdSelector = createSelector(
  selectedJointIdsSelector,
  wireJointPositionByJointIdSelector,
  (selectedJointIds, jointPositionsById) =>
    pick(jointPositionsById, selectedJointIds)
);

const DragMovePreviewLayer: React.FC = React.memo(
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
    const selectedJointPositionsById = useSelector(
      selectedJointPositionsByIdSelector
    );

    const dragMoveOffset = useSelector(dragMoveOffsetSelector);

    if (!isDragging || !dragMoveOffset) {
      return null;
    }

    const movingElements = values(
      mapValues(selectedElementPositionsById, (p, elementId) => (
        <ElementVisual
          key={elementId}
          elementType={selectedElementTypesById[elementId]}
          x={p.x + dragMoveOffset.x}
          y={p.y + dragMoveOffset.y}
        />
      ))
    );

    const movingJoints = values(
      mapValues(selectedJointPositionsById, (p, jointId) => (
        <circle
          key={jointId}
          cx={p.x + dragMoveOffset.x}
          cy={p.y + dragMoveOffset.y}
          r={2}
          stroke="none"
          fill="black"
        />
      ))
    );

    return (
      // FIXME: Get opacity from css
      <g id="drag-element-preview-layer" opacity={0.3}>
        {movingElements}
        {movingJoints}
      </g>
    );
  }
);

export default DragMovePreviewLayer;
