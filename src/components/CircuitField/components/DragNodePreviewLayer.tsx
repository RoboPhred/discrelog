import * as React from "react";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createSelector } from "reselect";

import { nodeTypesByNodeIdSelector } from "@/services/node-graph/selectors/nodes";
import { nodePositionsByNodeIdSelector } from "@/services/node-layout/selectors/node-positions";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";
import { dragMoveOffsetSelector } from "@/services/circuit-editor-ui-drag/selectors/drag";

import useSelector from "@/hooks/useSelector";

import NodeVisual from "./NodeVisual";

const selectedNodePositionsByIdSelector = createSelector(
  selectedNodeIdsSelector,
  nodePositionsByNodeIdSelector,
  (selectedNodeIds, nodePositionsById) =>
    pick(nodePositionsById, selectedNodeIds)
);

const selectedNodeTypesByIdSelector = createSelector(
  selectedNodeIdsSelector,
  nodeTypesByNodeIdSelector,
  (selectedNodeIds, nodeTypesById) => pick(nodeTypesById, selectedNodeIds)
);

const DragNodePreviewLayer: React.FC = React.memo(
  function DragNodePreviewLayer() {
    const selectedNodePositionsById = useSelector(
      selectedNodePositionsByIdSelector
    );
    const selectedNodeTypesById = useSelector(selectedNodeTypesByIdSelector);
    const dragMoveOffset = useSelector(dragMoveOffsetSelector);

    let elements: React.ReactNode | null = null;
    if (dragMoveOffset) {
      elements = values(
        mapValues(selectedNodePositionsById, (p, nodeId) => (
          <NodeVisual
            key={nodeId}
            nodeType={selectedNodeTypesById[nodeId]}
            nodeState={{}}
            x={p.x + dragMoveOffset.x}
            y={p.y + dragMoveOffset.y}
          />
        ))
      );
    }
    return (
      <g id="drag-node-preview-layer" opacity={0.3}>
        {elements}
      </g>
    );
  }
);

export default DragNodePreviewLayer;
