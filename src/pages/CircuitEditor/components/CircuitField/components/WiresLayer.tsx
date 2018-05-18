import * as React from "react";
import { createSelector, createStructuredSelector } from "reselect";

import { connect } from "react-redux";

import { Layer, Line } from "react-konva";

import { mapValues } from "lodash-es";

import { Node, NodesById, PinConnection } from "@/services/simulator/types";
import { NodeTypes } from "@/services/simulator/nodes";

import { State } from "@/store";

interface Connection {
  key: string;
  source: {
    x: number;
    y: number;
  };
  target: {
    x: number;
    y: number;
  };
  value: boolean;
}

const NO_POS = Object.freeze({ x: 0, y: 0 });

const nodesSelector = (s: State) => s.services.simulator.nodes;
const edgeSelector = createSelector(nodesSelector, nodes =>
  aggregateOutputs(Object.keys(nodes).map(k => nodes[k]))
);
const nodeTypesSelector = createSelector(nodesSelector, nodes =>
  mapValues(nodes, v => NodeTypes[v.type])
);
const connectionSelector = createSelector(
  edgeSelector,
  (s: State) => s.ui.circuitEditor.nodePositions,
  nodeTypesSelector,
  (s: State) => s.services.simulator.nodeOutputValues,
  (edges, nodePositions, nodeTypes, outputValues) => {
    return edges.map<Connection>(edge => {
      const {
        source: { nodeId: sid, pin: spin },
        target: { nodeId: tid, pin: tpin }
      } = edge;

      const sp = nodePositions[sid] || NO_POS;
      const st = nodeTypes[sid];
      const spp = (st && st.outputs[spin]) || NO_POS;

      const tp = nodePositions[tid] || NO_POS;
      const tt = nodeTypes[tid];
      const tpp = (tt && tt.inputs[tpin]) || NO_POS;

      const values = outputValues[sid];
      const value = values ? values[spin] : false;

      return {
        key: `${sid}:${spin}-${tid}:${tpin}`,
        source: {
          x: sp.x + spp.x,
          y: sp.y + spp.y
        },
        target: {
          x: tp.x + tpp.x,
          y: tp.y + tpp.y
        },
        value
      };
    });
  }
);

interface StateProps {
  connections: ReturnType<typeof connectionSelector>;
}
const mapStateToProps = createStructuredSelector<State, StateProps>({
  connections: connectionSelector
});

type Props = StateProps;
class WiresLayer extends React.Component<Props> {
  render() {
    const { connections } = this.props;

    const connectorElements = connections.map(c => (
      <Line
        key={c.key}
        points={[c.source.x, c.source.y, c.target.x, c.target.y]}
        stroke={c.value ? "green" : "black"}
      />
    ));

    return <Layer>{connectorElements}</Layer>;
  }
}
export default connect(mapStateToProps)(WiresLayer);

interface Edge {
  source: PinConnection;
  target: PinConnection;
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
