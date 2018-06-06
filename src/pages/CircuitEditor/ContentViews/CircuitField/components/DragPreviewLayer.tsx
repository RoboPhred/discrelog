import * as React from "react";
import { connect } from "react-redux";

import { pick, mapValues, values } from "lodash-es";

import { createStructuredSelector, createSelector } from "reselect";

import { Layer, Group } from "react-konva";

import { AppState } from "@/store";
import { IDMap, Point } from "@/types";

import { nodeTypesById, nodeStatesById } from "@/services/simulator/selectors";
import { NodeType } from "@/services/simulator/node-types";

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

// TODO: Pretty sure we can just pass an object in with these.
//  react-redux was not accepting it though, need to figure out why.
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  selectedNodePositionsById,
  selectedNodeTypesById,
  selectedNodeStatesById,
  dragMoveOffset
});
interface StateProps {
  selectedNodePositionsById: IDMap<Point>;
  selectedNodeTypesById: IDMap<NodeType>;
  selectedNodeStatesById: IDMap<any>;
  dragMoveOffset: Point | null;
}

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
