import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";

import { State } from "@/store";

const mouseOverNodeOutputsSelector = createSelector(
  (s: State) => s.services.simulator.nodeOutputValuesByNodeId,
  (s: State) => s.ui.circuitEditor.mouseOverNode,
  (outputs, nodeId) => (nodeId != null) ? outputs[nodeId] : {}
);

interface StateProps {
  nodeOutputValues: ReturnType<typeof mouseOverNodeOutputsSelector>;
}

const mapStateToProps = createStructuredSelector<State, StateProps>({
  nodeOutputValues: mouseOverNodeOutputsSelector
});

type Props = StateProps;
class NodeOutputs extends React.Component<Props> {
  render() {
    const { nodeOutputValues } = this.props;
    return (
      <div>
        <div>Node Outputs</div>
        <pre>
          <code>{JSON.stringify(nodeOutputValues, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
export default connect(mapStateToProps)(NodeOutputs);
