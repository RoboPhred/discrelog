import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Stage, Layer } from "react-konva";

import sizeme, { SizeProps } from "react-sizeme";

import { State } from "@/store";

import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

export interface CircuitFieldProps {
  className?: string;
}

interface StateProps {
}
const mapStateToProps = createStructuredSelector<State, StateProps>({
});

type Props = CircuitFieldProps & SizeProps & StateProps;
class CircuitField extends React.Component<Props> {
  render() {
    const {
      className,
      size: {
        width,
        height
      }
    } = this.props;

    return (
      <div className={className}>
        <Stage width={width} height={height}>
          <WiresLayer />
          <NodesLayer />
        </Stage>
      </div>
    );
  }
}

export default sizeme({ monitorWidth: true, monitorHeight: true, noPlaceholder: true })(connect(mapStateToProps)(CircuitField));
