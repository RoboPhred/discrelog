import * as React from "react";
import { createSelector, createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { Layer } from "react-konva";

import { Node, NodePin } from "@/services/simulator/types";

import { AppState } from "@/store";

import Wire from "./Wire";

const nodesSelector = (s: AppState) => s.services.simulator.nodesById;
const edgeSelector = createSelector(nodesSelector, nodes =>
  aggregateOutputs(Object.keys(nodes).map(k => nodes[k]))
);

interface StateProps {
  edges: ReturnType<typeof edgeSelector>;
}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  edges: edgeSelector
});

type Props = StateProps;
class WiresLayer extends React.Component<Props> {
  render() {
    const { edges } = this.props;

    const connectorElements = edges.map(edge => (
      <Wire key={edgeKey(edge)} {...edge} />
    ));

    return <Layer>{connectorElements}</Layer>;
  }
}
export default connect(mapStateToProps)(WiresLayer);

function edgeKey(edge: Edge): string {
  const { source, target } = edge;
  return `${source.nodeId}:${source.pin}-${target.nodeId}:${target.pin}`;
}

interface Edge {
  source: NodePin;
  target: NodePin;
}
function aggregateOutputs(nodes: Node[]): Edge[] {
  return nodes.reduce<Edge[]>((a, node) => {
    for (const outputPin of Object.keys(node.outputConnectionsByPin)) {
      for (const outputConn of node.outputConnectionsByPin[outputPin]) {
        a.push({
          source: {
            nodeId: node.id,
            pin: outputPin
          },
          target: outputConn
        });
      }
    }
    return a;
  }, []);
}
