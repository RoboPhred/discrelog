
import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Rect } from "react-konva";

import { Node } from "@/services/simulator/types";
import { State } from "@/store";

interface BodyProps extends ContainerConfig, KonvaNodeProps {
    nodeId: string;
    width: number;
    height: number;
    onClick(nodeId: string): void;
}

interface StateProps {
    node: Node;
    nodeState: any;
}
function mapStateToProps(state: State, props: BodyProps) {
    const { nodeId } = props;
    const simState = state.services.simulator;
    return {
        node: simState.nodes[nodeId],
        nodeState: simState.nodeStates[nodeId]
    }
}

type Props = BodyProps & StateProps;
class Body extends React.Component<Props> {
    render() {
        const {
            nodeId,
            node: {
                type
            },
            nodeState,
            onClick,
            width,
            height,
            ...groupProps
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
            <Group {...groupProps}>
                <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={fill}
                    onClick={onClick}
                />
            </Group>
        );
    }
}

export default connect(mapStateToProps)(Body);