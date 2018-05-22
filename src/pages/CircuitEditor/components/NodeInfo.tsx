import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";

import { mapValues } from "lodash-es";

import { State } from "@/store";

const mouseOverNode = createSelector(
  (s: State) => s.ui.circuitEditor.mouseOverNodeId,
  (s: State) => s.services.simulator.nodesById,
  (id, nodesById) => id ? nodesById[id] : null
);

const mouseOverNodeInputsSelector = createSelector(
  mouseOverNode,
  (s: State) => s.services.simulator.nodeOutputValuesByNodeId,
  (node, outputsByNodeId) => node ? mapValues(node.inputConnectionsByPin, (v, k) => {
    if (!v) {
      return null;
    }
    return outputsByNodeId[v.nodeId][v.pin];
  }) : {}
);

const mouseOverNodeOutputsSelector = createSelector(
  (s: State) => s.services.simulator.nodeOutputValuesByNodeId,
  (s: State) => s.ui.circuitEditor.mouseOverNodeId,
  (outputs, nodeId) => (nodeId != null) ? outputs[nodeId] : {}
);

interface StateProps {
  nodeInputValues: ReturnType<typeof mouseOverNodeInputsSelector>;
  nodeOutputValues: ReturnType<typeof mouseOverNodeOutputsSelector>;
}

const mapStateToProps = createStructuredSelector<State, StateProps>({
  nodeInputValues: mouseOverNodeInputsSelector,
  nodeOutputValues: mouseOverNodeOutputsSelector
});

type Props = StateProps;
class NodeInfo extends React.Component<Props> {
  render() {
    const { nodeInputValues, nodeOutputValues } = this.props;
    return (
      <div>
        <div>Node Inputs</div>
        <pre>
          <code>{JSON.stringify(nodeInputValues)}</code>
        </pre>
        <div>Node Outputs</div>
        <pre>
          <code>{JSON.stringify(nodeOutputValues, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
export default connect(mapStateToProps)(NodeInfo);
