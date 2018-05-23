import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group } from "react-konva";

import { AppState } from "@/store";

import { Node } from "@/services/simulator/types";
import { NodeTypes } from "@/services/simulator/node-types";

import Body from "./components/Body";
import Pin from "./components/Pin";

export interface CircuitNodePinoutProps
  extends ContainerConfig,
    KonvaNodeProps {
  nodeId: string;
  onClick(): void;
  onPinClick(direction: "input" | "output", pin: string): void;
}

interface StateProps {
  node: Node;
}
function mapStateToProps(
  state: AppState,
  props: CircuitNodePinoutProps
): StateProps {
  return {
    node: state.services.simulator.nodesById[props.nodeId]
  };
}

const PIN_LENGTH = 15;
const PIN_PADDING = 12;
const BODY_WIDTH = 50;
const BODY_HEIGHT = 50;

type Props = CircuitNodePinoutProps & StateProps;
class CircuitNode extends React.Component<Props> {
  render() {
    const { nodeId, node, onClick, onPinClick, ...groupProps } = this.props;

    const def = NodeTypes[node.type] || {};
    const inputs = def.inputs || [];
    const outputs = def.outputs || [];

    const yCenter = BODY_HEIGHT / 2;

    const inputPins = Object.keys(inputs).map(key => {
      const input = inputs[key];
      return (
        <Pin
          key={`input-${key}`}
          x={input.x}
          y={input.y}
          onClick={onPinClick.bind(null, "input", key)}
        />
      );
    });

    const outputPins = Object.keys(outputs).map(key => {
      const output = outputs[key];
      return (
        <Pin
          key={`output-${key}`}
          x={output.x}
          y={output.y}
          onClick={onPinClick.bind(null, "output", key)}
        />
      );
    });

    return (
      <Group {...groupProps}>
        <Body nodeId={nodeId} onClick={onClick} />
        {inputPins}
        {outputPins}
      </Group>
    );
  }
}
export default connect(mapStateToProps)(CircuitNode);
