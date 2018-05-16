
import * as React from "react";

import { connect } from "react-redux";

import { Group, Rect } from "react-konva";

import { Node } from "@/services/simulator/types";
import { State } from "@/store";

interface CircuitNodeProps {
    nodeId: string;
    onClick(nodeId: string): void;
}

interface StateProps {
    node: Node;
    nodeState: any;
}
function mapStateToProps(state: State, props: CircuitNodeProps) {
    const { nodeId } = props;
    const simState = state.services.simulator;
    return {
        node: simState.nodes[nodeId],
        nodeState: simState.nodeStates[nodeId]
    }
}

type Props = CircuitNodeProps & StateProps;
class CircuitNode extends React.Component<Props> {

    constructor(props: Props) {
        super(props);

        this._onClick = this._onClick.bind(this);
    }

    render() {
        const {
            node: {
                type
            },
            nodeState,
            onClick
        } = this.props;

        let fill = "blue";
        if (type === "toggle") {
            let checked = (nodeState || {}).toggleState;
            fill = checked ? "green" : "red";
        }
        else if (type === "led") {
            fill = (nodeState || {}).value ? "green" : "red";
        }
        return (
            <Rect
                x={0}
                y={0}
                width={50}
                height={50}
                fill={fill}
                onClick={this._onClick}
            />
        );
    }

    private _onClick() {
        const { nodeId, onClick } = this.props;
        onClick(nodeId);
    }
}

export default connect(mapStateToProps)(CircuitNode);