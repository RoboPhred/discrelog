import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Rect } from "react-konva";

import { AppState } from "@/store";

import { NodeDefinition } from "@/services/simulator/node-types";
import { nodesById, nodeDefsById } from "@/services/simulator/selectors";
import { Node } from "@/services/simulator/types";

import { selectedNodeIds } from "@/pages/CircuitEditor/selectors";

import Body from "./components/Body";
import Pin from "./components/Pin";

export interface CircuitNodeProps extends ContainerConfig, KonvaNodeProps {
  nodeId: string;
  onPinClick(
    direction: "input" | "output",
    pin: string,
    e: KonvaMouseEvent
  ): void;
}

interface StateProps {
  node: Node;
  def: NodeDefinition;
  isSelected: boolean;
}
function mapStateToProps(state: AppState, props: CircuitNodeProps): StateProps {
  return {
    node: nodesById(state)[props.nodeId],
    def: nodeDefsById(state)[props.nodeId],
    isSelected: selectedNodeIds(state).indexOf(props.nodeId) !== -1
  };
}

const PIN_LENGTH = 15;
const PIN_PADDING = 12;
const BODY_WIDTH = 50;
const BODY_HEIGHT = 50;

type Props = CircuitNodeProps & StateProps;
class CircuitNode extends React.Component<Props> {
  render() {
    const {
      nodeId,
      node,
      def,
      isSelected,
      onPinClick,
      ...groupProps
    } = this.props;

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
        <Body nodeId={nodeId} />
        {inputPins}
        {outputPins}
        {isSelected && <Rect width={10} height={10} fill="yellow" />}
      </Group>
    );
  }
}
export default connect(mapStateToProps)(CircuitNode);
