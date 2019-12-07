import * as React from "react";
import { connect } from "react-redux";

import { Group, Circle } from "react-konva";

import { ContainerConfig } from "konva";

import { AppState } from "@/store";

import { selectedPinSelector } from "@/pages/CircuitEditor/ContentViews/CircuitField/selectors";

const PIN_CIRCLE_RADIUS_UNSELECTED = 4;
const PIN_CIRCLE_RADIUS_SELECTED = 6;

export interface CircuitNodePinProps extends ContainerConfig {
  nodeId: string;
  pinId: string;
  onPinMouseDown?(pin: string, e: KonvaMouseEvent): void;
  onPinMouseUp?(pin: string, e: KonvaMouseEvent): void;
  onClick?(e: KonvaMouseEvent): void;
  onMouseDown?(e: KonvaMouseEvent): void;
  onMouseUp?(e: KonvaMouseEvent): void;
}

function mapStateToProps(state: AppState, props: CircuitNodePinProps) {
  const selected = selectedPinSelector(state);
  const { nodeId, pinId } = props;
  return {
    isSelected:
      selected && selected.nodeId === nodeId && selected.pinId === pinId
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
    const { pinId, onMouseDown, onPinMouseDown } = this.props;
    if (onPinMouseDown) {
      onPinMouseDown(pinId, e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    const { pinId, onMouseUp, onPinMouseUp } = this.props;
    if (onPinMouseUp) {
      onPinMouseUp(pinId, e);
    }
    if (onMouseUp) {
      onMouseUp(e);
    }
  }
}
export default connect(mapStateToProps)(CircuitNodePin);
