
import * as React from "react";

import { connect } from "react-redux";

import { Stage, Layer, Rect } from "react-konva";

import { State } from "@/store";
import { evolveSim, interactSim } from "@/services/simulator/actions";

import { Position, Size } from "../types";

interface CircuitFieldProps {
    fieldSize: Size,
    nodePositions: {
        [key: string]: Position
    },
    nodes: State["services"]["simulator"]["nodes"];
    nodeStates: any;
    tick: number;
    edgeValues: {[key: string]: boolean};
    transitionWindows: any;
    interactNode(nodeId: string): void;
    evolveSim(tickCount: number): void;
}

function mapStateToProps(state: State): Partial<CircuitFieldProps> {
    return {
        ...state.ui.circuitEditor,
        nodes: state.services.simulator.nodes,
        nodeStates: state.services.simulator.nodeStates,
        tick: state.services.simulator.tick,
        edgeValues: state.services.simulator.edgeValues,
        transitionWindows: state.services.simulator.transitionWindows
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
            nodes,
            nodeStates,
            tick,
            edgeValues,
            transitionWindows,
            nodePositions,
            interactNode,
            evolveSim
        } = this.props;

        const nodeElements = Object.keys(nodePositions).map(key => {
            const node = nodes[key];
            const { x, y } = nodePositions[key];
            let fill = "blue";
            if (node.type === "toggle") {
                let checked = nodeStates[key].toggleState;
                fill = checked ? "green" : "red";
            }
            else if (node.type === "console") {
                const edge = node.inputEdgeIds["IN"];
                fill = edgeValues[edge] ? "green" : "red";
            }
            return (
                <Rect 
                    x={x}
                    y={y}
                    width={50}
                    height={50}
                    fill={fill}
                    onClick={interactNode.bind(null, key)}
                />
            );   
        });
        
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
