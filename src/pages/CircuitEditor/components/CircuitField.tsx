
import * as React from "react";

import { connect } from "react-redux";

import { Stage, Layer, Group, Line } from "react-konva";

import { State as AppState } from "@/store";
import { SimulatorState } from "@/services/simulator/state";
import { evolveSim, interactNode, wireNode, unwireNode } from "@/services/simulator/actions";
import { isWired } from "@/services/simulator/helpers";

import { Position, Size } from "../types";
import { CircuitEditorState } from "../state";

import CircuitElement from "./CircuitElement";

type CircuitFieldProps = CircuitEditorState & SimulatorState & {
    interactNode(nodeId: string): void;
    evolveSim(tickCount: number): void;
    wireNode: typeof wireNode;
    unwireNode: typeof unwireNode;
}

function mapStateToProps(state: AppState): Partial<CircuitFieldProps> {
    return {
        ...state.ui.circuitEditor,
        ...state.services.simulator
    };
}

const mapDispatchToProps: Partial<CircuitFieldProps> = {
    interactNode: interactNode,
    evolveSim,
    wireNode,
    unwireNode
};

interface State {
    wireSourceNode: string | null;
    wireSourceOutput: string | null;
}
class CircuitField extends React.Component<CircuitFieldProps, State> {
    constructor(props: CircuitFieldProps) {
        super(props);
        this.state = {
            wireSourceNode: null,
            wireSourceOutput: null
        };
    }
    render() {
        const {
            fieldSize: {
                width,
                height
            },
            tick,
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
                <CircuitElement
                    key={key}
                    x={x}
                    y={y}
                    nodeId={key}
                    onClick={interactNode.bind(null, key)}
                    onPinClick={this._onPinClick.bind(this, key)}
                />
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
                        points={[25, 25, tp.x - sp.x + 25, tp.y - sp.y + 25]}
                        stroke={edgeValues[edge.id] ? "red" : "black"}
                    />
                );
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

    private _onPinClick(nodeId: string, direction: "input" | "output", pin: string) {
        if (direction === "output") {
            this.setState({
                wireSourceNode: nodeId,
                wireSourceOutput: pin
            });
            return;
        }

        const {
            wireSourceNode,
            wireSourceOutput
        } = this.state;
        if (!wireSourceNode || !wireSourceOutput) {
            return;
        }

        if (isWired(this.props, {nodeId: wireSourceNode, port: wireSourceOutput}, {nodeId, port: pin})) {
            this.props.unwireNode(wireSourceNode, wireSourceOutput, nodeId, pin);
        }
        else {
            this.props.wireNode(wireSourceNode, wireSourceOutput, nodeId, pin);
        }

        this.setState({
            wireSourceNode: null,
            wireSourceOutput: null
        });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CircuitField);
