import * as React from "react";
import { Group, Circle, KonvaNodeProps } from "react-konva";

import { ContainerConfig } from "konva";

import { NodePinDirection } from "@/services/simulator/types";

const PIN_CIRCLE_RADIUS = 6;

export interface CircuitNodePinProps extends ContainerConfig, KonvaNodeProps {
  id: string;
  direction: NodePinDirection;
  onClick?(e: KonvaMouseEvent): void;
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
    const { id, direction, onClick, onPinClick, ...groupProps } = this.props;
    return (
      <Group {...groupProps}>
        <Circle
          x={0}
          y={0}
          radius={PIN_CIRCLE_RADIUS}
          fill="black"
          onClick={onClick}
        />
      </Group>
    );
  }

  private _onClick(e: KonvaMouseEvent) {
    const { direction, id, onPinClick } = this.props;
    if (onPinClick) {
      onPinClick(direction, id, e);
    }
  }
}
