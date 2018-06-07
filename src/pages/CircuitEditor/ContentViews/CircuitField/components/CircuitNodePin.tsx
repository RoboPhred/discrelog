import * as React from "react";
import { Group, Circle, KonvaNodeProps } from "react-konva";

import { ContainerConfig } from "konva";

import { NodePinDirection } from "@/services/simulator/types";

const PIN_CIRCLE_RADIUS = 6;

export interface CircuitNodePinProps extends ContainerConfig, KonvaNodeProps {
  id: string;
  direction: NodePinDirection;
  onPinClick?(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
}
export default class CircuitNodePin extends React.Component<
  CircuitNodePinProps
> {
  constructor(props: CircuitNodePinProps) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  render() {
    const { id, direction, onClick, ...groupProps } = this.props;
    return (
      <Group {...groupProps}>
        <Circle
          x={0}
          y={0}
          radius={PIN_CIRCLE_RADIUS}
          fill="black"
          onClick={this._onClick}
        />
      </Group>
    );
  }

  private _onClick(e: KonvaMouseEvent) {
    const { direction, id, onClick, onPinClick } = this.props;
    if (onPinClick) {
      onPinClick(direction, id, e);
    }
    if (onClick) {
      onClick(e);
    }
  }
}
