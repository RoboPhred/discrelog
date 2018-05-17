
import * as React from "react";

import { connect } from "react-redux";

import { Stage, Layer, Group, Line } from "react-konva";

import { State as AppState } from "@/store";
import { SimulatorState } from "@/services/simulator/state";
import { evolveSim, interactNode, wireNode, unwireNode } from "@/services/simulator/actions";
import { isWired } from "@/services/simulator/helpers";
import { Nodes } from "@/services/simulator/nodes";

import { moveNode } from "../actions";

import { Position, Size } from "../types";
import { CircuitEditorState } from "../state";

import CircuitElement from "./CircuitElement";

type CircuitFieldProps = CircuitEditorState & SimulatorState & {
    interactNode(nodeId: string): void;
    evolveSim(tickCount: number): void;
    wireNode: typeof wireNode;
    unwireNode: typeof unwireNode;
    moveNode: typeof moveNode;
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
    unwireNode,
    moveNode
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
            nodes,
            edges,
            edgeValues,
            transitionWindows,
            nodePositions,
            interactNode,
            evolveSim,
            moveNode
        } = this.props;

        const nodeElements = Object.keys(nodePositions).map(key => {
            const { x, y } = nodePositions[key];
            return (
                <CircuitElement
                    key={key}
                    nodeId={key}
                    x={x}
                    y={y}
                    draggable
                    onDragMove={e => {
                        const pos = e.target.getAbsolutePosition();
                        moveNode(key, pos.x, pos.y);
                    }}
                    onClick={interactNode.bind(null, key)}
                    onPinClick={this._onPinClick.bind(this, key)}
                />
            );
        });

        const edgeData = Object.keys(edges).map(x => edges[x]);
        const connectorElements = ([] as JSX.Element[]).concat(...edgeData.map(edge => {
            const { source, targets } = edge;
            const sourceNode = nodes[source.nodeId];
            const sourceType = Nodes[sourceNode.type];
            const sp = {...nodePositions[source.nodeId]};
            const spp = sourceType && sourceType.outputs[source.port] ? sourceType.outputs[source.port] : {x: 0, y: 0};
            sp.x += spp.x;
            sp.y += spp.y;
            return targets.map(target => {
                const targetNode = nodes[target.nodeId];
                const targetType = Nodes[targetNode.type];
                const tp = {...nodePositions[target.nodeId]};
                const tpp = targetType && targetType.inputs[target.port] ? targetType.inputs[target.port] : {x: 0, y: 0};
                tp.x += tpp.x;
                tp.y += tpp.y;
                return (
                    <Line
                        key={edge.id}
                        points={[sp.x, sp.y, tp.x, tp.y]}
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
