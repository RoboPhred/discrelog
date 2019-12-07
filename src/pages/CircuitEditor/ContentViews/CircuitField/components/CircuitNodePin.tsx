import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "@/store";

import { selectedPinSelector } from "@/pages/CircuitEditor/ContentViews/CircuitField/selectors";

const PIN_CIRCLE_RADIUS_UNSELECTED = 4;
const PIN_CIRCLE_RADIUS_SELECTED = 6;

export interface CircuitNodePinProps {
  nodeId: string;
  pinId: string;
  x: number;
  y: number;
  onPinMouseDown?(pin: string, e: React.MouseEvent): void;
  onPinMouseUp?(pin: string, e: React.MouseEvent): void;
  onClick?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
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
      x,
      y,
      isSelected,
      onClick,
    } = this.props;
    return (
      <circle
        cx={x}
        cy={y}
        r={
          isSelected
            ? PIN_CIRCLE_RADIUS_SELECTED
            : PIN_CIRCLE_RADIUS_UNSELECTED
        }
        fill={isSelected ? "yellow" : "blue"}
        onClick={onClick}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
      />
    );
  }

  private _onMouseDown(e: React.MouseEvent) {
    const { pinId, onMouseDown, onPinMouseDown } = this.props;
    if (onPinMouseDown) {
      onPinMouseDown(pinId, e);
    }
    if (onMouseDown) {
      onMouseDown(e);
    }
  }

  private _onMouseUp(e: React.MouseEvent) {
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
