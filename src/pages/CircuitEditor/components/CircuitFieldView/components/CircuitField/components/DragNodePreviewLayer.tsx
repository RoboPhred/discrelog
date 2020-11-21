import * as React from "react";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createSelector } from "reselect";

import { elementTypesByNodeIdSelector } from "@/services/circuit-graph/selectors/nodes";
import { nodeStatesByIdSelector } from "@/services/simulator/selectors/nodes";
import { nodePositionsByNodeIdSelector } from "@/services/circuit-layout/selectors/node-positions";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { dragMoveOffsetSelector } from "@/services/circuit-editor-ui/selectors/drag";

import ElementVisual from "@/pages/CircuitEditor/components/ElementVisual";
import useSelector from "@/hooks/useSelector";

const selectedNodePositionsByIdSelector = createSelector(
  selectedNodeIdsSelector,
  nodePositionsByNodeIdSelector,
  (selectedNodeIds, nodePositionsById) =>
    pick(nodePositionsById, selectedNodeIds)
);

const selectedNodeTypesByIdSelector = createSelector(
  selectedNodeIdsSelector,
  elementTypesByNodeIdSelector,
  (selectedNodeIds, nodeTypesById) => pick(nodeTypesById, selectedNodeIds)
);

const selectedNodeStatesByIdSelector = createSelector(
  selectedNodeIdsSelector,
  nodeStatesByIdSelector,
  (selectedNodeIds, nodeStatesById) => pick(nodeStatesById, selectedNodeIds)
);

const DragNodePreviewLayer: React.FC = () => {
  const selectedNodePositionsById = useSelector(
    selectedNodePositionsByIdSelector
  );
  const selectedNodeTypesById = useSelector(selectedNodeTypesByIdSelector);
  const selectedNodeStatesById = useSelector(selectedNodeStatesByIdSelector);
  const dragMoveOffset = useSelector(dragMoveOffsetSelector);

  let elements: React.ReactNode | null = null;
  if (dragMoveOffset) {
    elements = values(
      mapValues(selectedNodePositionsById, (p, nodeId) => (
        <ElementVisual
          key={nodeId}
          elementType={selectedNodeTypesById[nodeId]}
          nodeState={selectedNodeStatesById[nodeId]}
          x={p.x + dragMoveOffset.x}
          y={p.y + dragMoveOffset.y}
        />
      ))
    );
  }
  return (
    <g id="drag-preview-layer" opacity={0.3}>
      {elements}
    </g>
  );
};

export default DragNodePreviewLayer;
