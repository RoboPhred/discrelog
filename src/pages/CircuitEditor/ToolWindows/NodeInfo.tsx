import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector, createSelector } from "reselect";

import mapValues from "lodash/mapValues";

import { AppState } from "@/store";
import {
  nodeOutputValuesByNodeIdSelector,
  nodeInputConnectionsByPinSelector
} from "@/services/simulator/selectors";

const mouseOverNode = createSelector(
  (s: AppState) => s.ui.circuitEditor.mouseOverNodeId,
  (s: AppState) => s.services.simulator.nodesById,
  (id, nodesById) => (id ? nodesById[id] : null)
);

const mouseOverNodeInputsSelector = createSelector(
  mouseOverNode,
  nodeOutputValuesByNodeIdSelector,
  s => s, // TODO: This state selector busts the createSelector cache.  Memoize this better.
  (node, outputsByNodeId, s) => {
    if (!node) {
      return {};
    }

    const nodeInputs = nodeInputConnectionsByPinSelector(s, node.id);

    return mapValues(nodeInputs, sourcePin => {
      if (!sourcePin) {
        return null;
      }
      const { nodeId, pin } = sourcePin;
      return outputsByNodeId[nodeId][pin];
    });
  }
);

const mouseOverNodeOutputsSelector = createSelector(
  (s: AppState) => s.services.simulator.nodeOutputValuesByNodeId,
  (s: AppState) => s.ui.circuitEditor.mouseOverNodeId,
  (outputs, nodeId) => (nodeId != null ? outputs[nodeId] : {})
);

interface StateProps {
  nodeInputValues: ReturnType<typeof mouseOverNodeInputsSelector>;
  nodeOutputValues: ReturnType<typeof mouseOverNodeOutputsSelector>;
}

const mapStateToProps = createStructuredSelector<AppState, StateProps>({
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
