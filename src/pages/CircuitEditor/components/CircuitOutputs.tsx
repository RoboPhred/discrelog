import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { State } from "@/store";

const nodeOutputValuesSelector = (s: State) =>
  s.services.simulator.nodeOutputValues;

interface StateProps {
  nodeOutputValues: ReturnType<typeof nodeOutputValuesSelector>;
}

const mapStateToProps = createStructuredSelector<State, StateProps>({
  nodeOutputValues: nodeOutputValuesSelector
});

type Props = StateProps;
class CircuitOutputs extends React.Component<Props> {
  render() {
    const { nodeOutputValues } = this.props;

    return (
      <div>
        <div>Output values</div>
        <pre>
          <code>{JSON.stringify(nodeOutputValues, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
export default connect(mapStateToProps)(CircuitOutputs);
