import * as React from "react";
import { connect } from "react-redux";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createStructuredSelector, createSelector } from "reselect";

import { AppState } from "@/store";

import {
  nodeTypesByIdSelector,
  nodeStatesByIdSelector
} from "@/services/simulator/selectors/nodes";
import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

import NodeVisual from "@/pages/CircuitEditor/components/NodeVisual";

import { dragMoveOffsetSelector } from "../selectors";

const selectedNodePositionsById = createSelector(
  selectedNodeIdsSelector,
  nodePositionsByIdSelector,
  (selectedNodeIds, nodePositionsById) =>
    pick(nodePositionsById, selectedNodeIds)
);

const selectedNodeTypesById = createSelector(
  selectedNodeIdsSelector,
  nodeTypesByIdSelector,
  (selectedNodeIds, nodeTypesById) => pick(nodeTypesById, selectedNodeIds)
);

const selectedNodeStatesById = createSelector(
  selectedNodeIdsSelector,
  nodeStatesByIdSelector,
  (selectedNodeIds, nodeStatesById) => pick(nodeStatesById, selectedNodeIds)
);

const stateSelectors = {
  selectedNodePositionsById,
  selectedNodeTypesById,
  selectedNodeStatesById,
  dragMoveOffset: dragMoveOffsetSelector
};
type StateProps = ObjectValueReturnTypes<typeof stateSelectors>;
const mapStateToProps = createStructuredSelector<AppState, StateProps>(
  stateSelectors
);

type Props = StateProps;
class DragPreviewLayer extends React.Component<Props> {
  render() {
    const {
      selectedNodePositionsById,
      selectedNodeTypesById,
      selectedNodeStatesById,
      dragMoveOffset
    } = this.props;

    let elements: React.ReactNode | null = null;
    if (dragMoveOffset) {
      elements = values(
        mapValues(selectedNodePositionsById, (p, nodeId) => (
          <NodeVisual
            key={nodeId}
            nodeType={selectedNodeTypesById[nodeId]}
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
  }
}
export default connect(mapStateToProps)(DragPreviewLayer);
