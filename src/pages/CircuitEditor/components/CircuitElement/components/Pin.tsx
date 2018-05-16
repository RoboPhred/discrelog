import * as React from "react";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Circle, Line } from "react-konva";

export interface PinProps extends ContainerConfig, KonvaNodeProps {
    orientation: "left" | "right";
    length: number;
}

const PIN_CIRCLE_RADIUS = 4;
const PIN_TRACE_WIDTH = 2;

type Props = PinProps;
class Pin extends React.Component<Props> {
    render() {
        const {
            orientation,
            length,
            ...groupProps
        } = this.props;
        const toRight = orientation === "right";
        return (
            <Group {...groupProps}>
                <Line
                    x={0}
                    y={0}
                    points={[0, 0, length, 0]}
                    stroke="black"
                    strokeWidth={PIN_TRACE_WIDTH}
                />
                <Circle
                    x={toRight ? length - PIN_CIRCLE_RADIUS : PIN_CIRCLE_RADIUS}
                    y={0}
                    radius={PIN_CIRCLE_RADIUS}
                    fill="black"
                />
            </Group>
        );
    }
}
export default Pin;