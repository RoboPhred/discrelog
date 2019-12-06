import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { AppState } from "@/store";

import { evolveSim } from "@/services/simulator/actions/sim-evolve";

interface StateProps {
  tick: number;
}

const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  tick: s => s.services.simulator.tick
});

const mapDispatchToProps = {
  evolveSim
};
type DispatchProps = typeof mapDispatchToProps;

type Props = StateProps & DispatchProps;
class TimingControls extends React.Component<Props> {
  render() {
    const { tick, evolveSim } = this.props;

    return (
      <div>
        Ticks: {tick} <button onClick={evolveSim.bind(null, 1)}>Tick</button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimingControls);
