import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { State } from "@/store";

import { evolveSim } from "@/services/simulator/actions";

interface StateProps {
  tick: number;
}

const mapStateToProps = createStructuredSelector<State, StateProps>({
  tick: s => s.services.simulator.tick
});

interface DispatchProps {
  evolveSim: typeof evolveSim;
}

const mapDispatchToProps = {
  evolveSim
};

type Props = StateProps & DispatchProps;
class TimingControls extends React.Component<Props> {
  render() {
    const {
      tick,
      evolveSim
    } = this.props;

    return (
      <div>
        Ticks: {tick}{" "}
        <button onClick={evolveSim.bind(null, 4)}>Tick 4</button>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TimingControls);
