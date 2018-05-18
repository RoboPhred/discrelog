
import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Stage, Layer } from "react-konva";

import { State } from "@/store";

import { evolveSim } from "@/services/simulator/actions";

import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

interface StateProps {
    tick: number;
    width: number;
    height: number;
    nodeOutputValues: any,
    transitionWindows: any
}
const mapStateToProps = createStructuredSelector<State, StateProps>({
    tick: s => s.services.simulator.tick,
    width: s => s.ui.circuitEditor.fieldSize.width,
    height: s => s.ui.circuitEditor.fieldSize.height,
    nodeOutputValues: s => s.services.simulator.nodeOutputValues,
    transitionWindows: s => s.services.simulator.transitionWindows
});

interface DispatchProps {
    evolveSim: typeof evolveSim
};

const mapDispatchToProps = {
    evolveSim
};

type Props = StateProps & DispatchProps;
class CircuitField extends React.Component<Props> {
    render() {
        const {
            tick,
            width,
            height,
            nodeOutputValues,
            transitionWindows,
            evolveSim
        } = this.props;

        return (
            <div>
                <div>
                    Circuit Field
                </div>
                <div>
                    Ticks: {tick} <button onClick={evolveSim.bind(null, 4)}>Tick 4</button>
                </div>
                <Stage width={width} height={height}>
                    <WiresLayer/>
                    <NodesLayer/>
                </Stage>
                <div>
                    <div>Output values</div>
                    <pre><code>{JSON.stringify(nodeOutputValues, null, 2)}</code></pre>
                </div>
                <div>
                    <div>Pending Transitions</div>
                    <pre><code>{JSON.stringify(transitionWindows, null, 2)}</code></pre>
                </div>
            </div>
        );
    }


}

export default connect(mapStateToProps, mapDispatchToProps)(CircuitField);
