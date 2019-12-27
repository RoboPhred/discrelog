import * as React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { AppState } from "@/store";
import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";

import CircuitNode from "./CircuitNode";

export interface NodesLayerProps {}

const stateSelectors = {
  nodePositionsById: nodePositionsByIdSelector
};
type StateProps = ObjectValueReturnTypes<typeof stateSelectors>;
const mapStateToProps = createStructuredSelector<AppState, StateProps>(
  stateSelectors
);

type Props = NodesLayerProps & StateProps;
class NodesLayer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { nodePositionsById } = this.props;

    const nodeElements = Object.keys(nodePositionsById).map(nodeId => {
      const { x, y } = nodePositionsById[nodeId];
      return <CircuitNode key={nodeId} nodeId={nodeId} x={x} y={y} />;
    });

    return <g id="nodes-layer">{nodeElements}</g>;
  }
}
export default connect(mapStateToProps)(NodesLayer);
