import * as React from "react";
import { connect } from "react-redux";

import { pick, mapValues, values } from "lodash-es";

import { createStructuredSelector, createSelector } from "reselect";

import { Layer, Group } from "react-konva";

import { Position } from "@/types";

import { AppState } from "@/store";

import {
  selectedNodeIds,
  nodePositionsById
} from "@/pages/CircuitEditor/selectors";

import Body from "./CircuitNode/components/Body";

import { dragMoveOffset } from "../selectors";
import { IDMap } from "@/types";

// TODO: Pretty sure we can just pass an object in with these.
//  react-redux was not accepting it though, need to figure out why.
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  selectedNodePositionsById: createSelector(
    selectedNodeIds,
    nodePositionsById,
    (selectedNodeIds, nodePositionsById) =>
      pick(nodePositionsById, selectedNodeIds)
  ),
  dragMoveOffset
});
interface StateProps {
  selectedNodePositionsById: IDMap<Position>;
  dragMoveOffset: Position | null;
}

type Props = StateProps;
class DragPreviewLayer extends React.Component<Props> {
  render() {
    const { selectedNodePositionsById, dragMoveOffset } = this.props;

    let elements: React.ReactNode | null = null;
    if (dragMoveOffset) {
      elements = values(
        mapValues(selectedNodePositionsById, (p, nodeId) => (
          <Body
            key={nodeId}
            x={p.x + dragMoveOffset.x}
            y={p.y + dragMoveOffset.y}
            nodeId={nodeId}
          />
        ))
      );
    }
    return <Layer>{elements}</Layer>;
  }
}
export default connect(mapStateToProps)(DragPreviewLayer);
