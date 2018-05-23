import * as React from "react";

import styled from "styled-components";

import { connect } from "react-redux";

import { Stage, Layer, Rect } from "react-konva";

import sizeme, { SizeProps } from "react-sizeme";

import { normalizeRectangle, calcSize } from "@/geometry";
import { Position } from "@/types";
import { AppState } from "@/store";

import { clearSelection, selectRegion } from "@/pages/CircuitEditor/actions";

import WiresLayer from "./components/WiresLayer";
import NodesLayer from "./components/NodesLayer";

export interface CircuitFieldProps {
  className?: string;
}

const CircuitFieldContainer = styled.div`
  overflow: hidden;
`;

const mapDispatchToProps = {
  clearSelection,
  selectRegion
};
type DispatchProps = typeof mapDispatchToProps;

type Props = CircuitFieldProps & SizeProps & DispatchProps;
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
    this._onClick = this._onClick.bind(this);
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
          onClick={this._onClick}
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
    if (e.evt.defaultPrevented) {
      return;
    }

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

    if (e.evt.defaultPrevented) {
      return;
    }
    e.evt.preventDefault();

    this.setState({
      dragEnd: {
        x: e.evt.layerX,
        y: e.evt.layerY
      }
    });
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    const { dragStart, dragEnd } = this.state;
    this.setState({
      dragStart: null,
      dragEnd: null
    });

    if (!dragStart || !dragEnd) {
      return;
    }

    const r = normalizeRectangle(dragStart, dragEnd);
    const s = calcSize(r);
    if (s.width < 5 || s.height < 5) {
      return;
    }

    e.evt.preventDefault();
    this.props.selectRegion({ p1: dragStart, p2: dragEnd });
  }

  private _onClick(e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }
    e.evt.preventDefault();

    this.props.clearSelection();
  }
}

export default sizeme({
  monitorWidth: true,
  monitorHeight: true,
  noPlaceholder: true
})(connect(null, mapDispatchToProps)(CircuitField));
