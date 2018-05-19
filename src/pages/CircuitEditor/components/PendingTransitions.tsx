import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { State } from "@/store";

const transitionWindowsSelector = (s: State) => s.services.simulator.transitionWindows;

interface StateProps {
  transitionWindows: ReturnType<typeof transitionWindowsSelector>;
}

const mapStateToProps = createStructuredSelector<State, StateProps>({
  transitionWindows: transitionWindowsSelector
});

type Props = StateProps;
class PendingTransitions extends React.Component<Props> {
  render() {
    const {
      transitionWindows
    } = this.props;

    return (
      <div>
        <div>Pending Transitions</div>
        <pre>
          <code>{JSON.stringify(transitionWindows, null, 2)}</code>
        </pre>
      </div>
    );
  }
}
export default connect(mapStateToProps)(PendingTransitions);
