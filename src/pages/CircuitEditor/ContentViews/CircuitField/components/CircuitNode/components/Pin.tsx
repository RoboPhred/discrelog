import * as React from "react";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Circle, Line } from "react-konva";

export interface PinProps extends ContainerConfig, KonvaNodeProps {
  onClick(): void;
}

const PIN_CIRCLE_RADIUS = 6;

type Props = PinProps;
class Pin extends React.Component<Props> {
  render() {
    const { onClick, ...groupProps } = this.props;
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
}
export default Pin;
