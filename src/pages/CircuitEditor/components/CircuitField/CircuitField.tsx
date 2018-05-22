import * as React from "react";

import styled from "styled-components";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Stage, Layer, Rect } from "react-konva";

import sizeme, { SizeProps } from "react-sizeme";

import { Position } from "@/types";
import { State as AppState } from "@/store";

import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

export interface CircuitFieldProps {
  className?: string;
}

interface StateProps {}
const mapStateToProps = createStructuredSelector<AppState, StateProps>({});

const CircuitFieldContainer = styled.div`
  overflow: hidden;
`;

type Props = CircuitFieldProps & SizeProps & StateProps;
interface State {
  dragStart: Position | null;
  dragEnd: Position | null;
}
class CircuitField extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      dragStart: null,
      dragEnd: null
    };

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
  }
  render() {
    const {
      className,
      size: { width, height }
    } = this.props;
    const { dragStart, dragEnd } = this.state;

    return (
      <CircuitFieldContainer className={className}>
        <Stage
          width={width}
          height={height}
          onMouseDown={this._onMouseDown}
          onMouseMove={this._onMouseMove}
          onMouseUp={this._onMouseUp}
        >
          {dragStart &&
            dragEnd && (
              <Layer>
                <Rect
                  x={Math.min(dragStart.x, dragEnd.x)}
                  y={Math.min(dragStart.y, dragEnd.y)}
                  width={Math.abs(dragEnd.x - dragStart.x)}
                  height={Math.abs(dragEnd.y - dragStart.y)}
                  fill="blue"
                />
              </Layer>
            )}
          <WiresLayer />
          <NodesLayer />
        </Stage>
      </CircuitFieldContainer>
    );
  }

  private _onMouseDown(e: KonvaMouseEvent) {
    console.log(e);
    this.setState({
      dragStart: {
        x: e.evt.layerX,
        y: e.evt.layerY
      },
      dragEnd: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onMouseMove(e: KonvaMouseEvent) {
    if (!this.state.dragStart) {
      return;
    }

    this.setState({
      dragEnd: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    this.setState({
      dragStart: null,
      dragEnd: null
    });

    // TODO: select nodes by hit test
    // https://www.npmjs.com/package/svg-path-bounds
  }
}

export default sizeme({
  monitorWidth: true,
  monitorHeight: true,
  noPlaceholder: true
})(connect(mapStateToProps)(CircuitField));
