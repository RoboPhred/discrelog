import * as React from "react";
import { connect } from "react-redux";

import pick from "lodash/pick";
import mapValues from "lodash/mapValues";
import values from "lodash/values";

import { createStructuredSelector, createSelector } from "reselect";

import { Layer } from "react-konva";

import { AppState } from "@/store";

import { nodeTypesById, nodeStatesById } from "@/services/simulator/selectors";

import {
  selectedNodeIds,
  nodePositionsById
} from "@/pages/CircuitEditor/selectors";

import NodeVisual from "@/pages/CircuitEditor/components/NodeVisual";

import { dragMoveOffset } from "../selectors";

const selectedNodePositionsById = createSelector(
  selectedNodeIds,
  nodePositionsById,
  (selectedNodeIds, nodePositionsById) =>
    pick(nodePositionsById, selectedNodeIds)
);

const selectedNodeTypesById = createSelector(
  selectedNodeIds,
  nodeTypesById,
  (selectedNodeIds, nodeTypesById) => pick(nodeTypesById, selectedNodeIds)
);

const selectedNodeStatesById = createSelector(
  selectedNodeIds,
  nodeStatesById,
  (selectedNodeIds, nodeStatesById) => pick(nodeStatesById, selectedNodeIds)
);

const stateSelectors = {
  selectedNodePositionsById,
  selectedNodeTypesById,
  selectedNodeStatesById,
  dragMoveOffset
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
    return <Layer>{elements}</Layer>;
  }
}
export default connect(mapStateToProps)(DragPreviewLayer);
