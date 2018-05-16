
import * as React from "react";

import { connect } from "react-redux";

import { Stage, Layer, Group, Line } from "react-konva";

import { State } from "@/store";
import { SimulatorState } from "@/services/simulator/state";
import { evolveSim, interactSim } from "@/services/simulator/actions";

import { Position, Size } from "../types";
import { CircuitEditorState } from "../state";

import CircuitNode from "./CircuitNode";

type CircuitFieldProps = CircuitEditorState & SimulatorState & {
    interactNode(nodeId: string): void;
    evolveSim(tickCount: number): void;
}

function mapStateToProps(state: State): Partial<CircuitFieldProps> {
    return {
        ...state.ui.circuitEditor,
        ...state.services.simulator
    };
}

const mapDispatchToProps: Partial<CircuitFieldProps> = {
    interactNode: interactSim,
    evolveSim
};

class CircuitField extends React.Component<CircuitFieldProps> {
    render() {
        const {
            fieldSize: {
                width,
                height
            },
            tick,
            nodes,
            nodeStates,
            edges,
            edgeValues,
            transitionWindows,
            nodePositions,
            interactNode,
            evolveSim
        } = this.props;

        const nodeElements = Object.keys(nodePositions).map(key => {
            const { x, y } = nodePositions[key];
            return (
                <Group key={key} x={x} y={y}>
                    <CircuitNode nodeId={key} onClick={interactNode}/>
                </Group>
            );
        });

        const edgeData = Object.keys(edges).map(x => edges[x]);
        const connectorElements = ([] as JSX.Element[]).concat(...edgeData.map(edge => {
            const { source, targets } = edge;
            const sp = nodePositions[source.nodeId];
            return targets.map(target => {
                const tp = nodePositions[target.nodeId];
                return (
                    <Line
                        key={edge.id}
                        x={sp.x}
                        y={sp.y}
                        points={[25, 25, tp.x-sp.x+25, tp.y-sp.y+25]}
                        stroke={edgeValues[edge.id] ? "red" : "black"}
                    />
                )
            })
        }));

        return (
            <div>
                <div>
                    Circuit Field
                </div>
                <div>
                    Ticks: {tick} <button onClick={evolveSim.bind(null, 4)}>Tick 4</button>
                </div>
                <Stage width={width} height={height}>
                    <Layer>
                        {connectorElements}
                    </Layer>
                    <Layer>
                        {nodeElements}
                    </Layer>
                </Stage>
                <div>
                    <div>Edge values</div>
                    <pre><code>{JSON.stringify(edgeValues, null, 2)}</code></pre>
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
