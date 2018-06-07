import * as React from "react";
import { connect } from "react-redux";

import { Group, Circle, KonvaNodeProps } from "react-konva";

import { ContainerConfig } from "konva";

import { AppState } from "@/store";

import { NodePinDirection } from "@/services/simulator";
import { selectedPin } from "@/pages/CircuitEditor/ContentViews/CircuitField/selectors";

const PIN_CIRCLE_RADIUS_UNSELECTED = 4;
const PIN_CIRCLE_RADIUS_SELECTED = 6;

export interface CircuitNodePinProps extends ContainerConfig, KonvaNodeProps {
  nodeId: string;
  pinId: string;
  direction: NodePinDirection;
  onPinMouseDown?(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
  onPinMouseUp?(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
}

function mapStateToProps(state: AppState, props: CircuitNodePinProps) {
  const selected = selectedPin(state);
  const { nodeId, pinId, direction } = props;
  return {
    isSelected:
      selected &&
      selected.nodeId === nodeId &&
      selected.direction === direction &&
      selected.pin === pinId
  };
}
type StateProps = ReturnType<typeof mapStateToProps>;

type Props = CircuitNodePinProps & StateProps;
class CircuitNodePin extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }

  render() {
    const {
      // All of our props are pulled out to prevent them
      //  being included in groupProps
      nodeId,
      pinId,
      direction,
      isSelected,
      onClick,
      ...groupProps
    } = this.props;
    return (
      <Group {...groupProps}>
        <Circle
          x={0}
          y={0}
          radius={
            isSelected
              ? PIN_CIRCLE_RADIUS_SELECTED
              : PIN_CIRCLE_RADIUS_UNSELECTED
          }
          fill={isSelected ? "yellow" : "blue"}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
        />
      </Group>
    );
  }

  private _onMouseDown(e: KonvaMouseEvent) {
    const { direction, pinId, onMouseDown, onPinMouseDown } = this.props;
    if (onPinMouseDown) {
      onPinMouseDown(direction, pinId, e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    const { direction, pinId, onMouseUp, onPinMouseUp } = this.props;
    if (onPinMouseUp) {
      onPinMouseUp(direction, pinId, e);
    }
    if (onMouseUp) {
      onMouseUp(e);
    }
  }
}
export default connect(mapStateToProps)(CircuitNodePin);
