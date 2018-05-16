import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group } from "react-konva";

import { State } from "@/store";

import { Node } from "@/services/simulator/types";
import { Nodes } from "@/services/simulator/nodes";

import Body from "./components/Body";
import Pin from "./components/Pin";

export interface CircuitNodePinoutProps extends ContainerConfig, KonvaNodeProps {
    nodeId: string;
    onClick(nodeId: string): void;
}

interface StateProps {
    node: Node
}
function mapStateToProps(state: State, props: CircuitNodePinoutProps): StateProps {
    return {
        node: state.services.simulator.nodes[props.nodeId]
    }
}

const PIN_LENGTH = 15;
const PIN_PADDING = 12;
const BODY_WIDTH = 50;
const BODY_HEIGHT = 50;

type Props = CircuitNodePinoutProps & StateProps;
class CircuitElement extends React.Component<Props> {
    render() {
        const {
            nodeId,
            node,
            onClick,
            ...groupProps
        } = this.props;

        const nodeType = Nodes[node.type] || {};
        const inputs = nodeType.inputs || [];
        const outputs = nodeType.outputs || [];

        const yCenter = BODY_HEIGHT / 2;

        // Total height of the input pin area
        const inputTotalHeight = PIN_PADDING * inputs.length;
        // The y position of the first pin.  Add half the padding as pins y 0 is centered.
        const inputFirstY = yCenter - (inputTotalHeight / 2) + PIN_PADDING / 2;
        const inputPins = inputs.map((name, i) => {
            return (
                <Pin
                    key={`input-${name}:${i}`}
                    orientation="left"
                    length={PIN_LENGTH}
                    x={0}
                    y={inputFirstY + PIN_PADDING * i}
                />
            );
        });

        const outputTotalHeight = PIN_PADDING * outputs.length;
        const outputFirstY = yCenter - (outputTotalHeight / 2) + PIN_PADDING / 2;
        const outputPins = outputs.map((name, i) => {
            return (
                <Pin
                    key={`output-${name}:${i}`}
                    orientation="right"
                    length={PIN_LENGTH}
                    x={BODY_WIDTH + PIN_LENGTH}
                    y={outputFirstY + PIN_PADDING * i}
                />
            );
        });

        return (
            <Group {...groupProps}>
                {inputPins}
                <Body
                    x={PIN_LENGTH}
                    y={0}
                    width={BODY_WIDTH}
                    height={BODY_HEIGHT}
                    nodeId={nodeId}
                    onClick={onClick}
                />
                {outputPins}
            </Group>
        );
    }
}
export default connect(mapStateToProps)(CircuitElement);
