import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { ContainerConfig } from "konva";
import { Layer } from "react-konva";

import { AppState } from "@/store";

import { NodePinDirection } from "@/services/simulator/types";

import { nodePositionsById } from "@/pages/CircuitEditor/selectors";

import CircuitNode from "./CircuitNode";

export interface NodesLayerProps {
  onNodeMouseDown?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseUp?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseOver?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseLeave?(node: string, e: KonvaMouseEvent): void;
  onNodePinMouseDown?(
    nodeId: string,
    pinDirection: NodePinDirection,
    pinId: string,
    e: KonvaMouseEvent
  ): void;
  onNodePinMouseUp?(
    nodeId: string,
    pinDirection: NodePinDirection,
    pinId: string,
    e: KonvaMouseEvent
  ): void;
}

const stateSelectors = {
  nodePositionsById
};
type StateProps = ObjectValueReturnTypes<typeof stateSelectors>;
const mapStateToProps = createStructuredSelector<AppState, StateProps>(
  stateSelectors
);

type Props = NodesLayerProps & StateProps;
class NodesLayer extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this._onPinMouseDown = this._onPinMouseDown.bind(this);
    this._onPinMouseUp = this._onPinMouseUp.bind(this);
  }

  render() {
    const {
      nodePositionsById,
      onNodeMouseDown,
      onNodeMouseUp,
      onNodeMouseOver,
      onNodeMouseLeave
    } = this.props;

    const nodeElements = Object.keys(nodePositionsById).map(key => {
      const { x, y } = nodePositionsById[key];
      return (
        <BoundCicrcuitNode
          key={key}
          nodeId={key}
          x={x}
          y={y}
          onMouseDown={onNodeMouseDown}
          onMouseUp={onNodeMouseUp}
          onMouseOver={onNodeMouseOver}
          onMouseLeave={onNodeMouseLeave}
          onPinMouseDown={this._onPinMouseDown}
          onPinMouseUp={this._onPinMouseUp}
        />
      );
    });

    return <Layer>{nodeElements}</Layer>;
  }

  private _onPinMouseDown(
    nodeId: string,
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    e.evt.stopPropagation();

    const { onNodePinMouseDown } = this.props;
    if (onNodePinMouseDown) {
      onNodePinMouseDown(nodeId, direction, pin, e);
    }
  }

  private _onPinMouseUp(
    nodeId: string,
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    const { onNodePinMouseUp } = this.props;
    if (onNodePinMouseUp) {
      onNodePinMouseUp(nodeId, direction, pin, e);
    }
  }
}
export default connect(mapStateToProps)(NodesLayer);

interface BoundCicrcuitNodeProps extends ContainerConfig {
  nodeId: string;
  // TODO: Passing these down the hierarchy is silly.
  //  Some of them can be handled in their originating element
  //  with their own event actions.
  onMouseDown?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseUp?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseOver?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseLeave?(nodeId: string, e: KonvaMouseEvent): void;
  onPinMouseDown?(
    nodeId: string,
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
  onPinMouseUp?(
    nodeId: string,
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
}
class BoundCicrcuitNode extends React.Component<BoundCicrcuitNodeProps> {
  constructor(props: BoundCicrcuitNodeProps) {
    super(props);

    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseUp = this._onMouseUp.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onPinMouseDown = this._onPinMouseDown.bind(this);
    this._onPinMouseUp = this._onPinMouseUp.bind(this);
  }

  render() {
    const {
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onMouseLeave,
      onPinMouseDown,
      onPinMouseUp,
      ...otherProps
    } = this.props;
    return (
      <CircuitNode
        {...otherProps}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseOver={this._onMouseOver}
        onMouseLeave={this._onMouseLeave}
        onPinMouseDown={this._onPinMouseDown}
        onPinMouseUp={this._onPinMouseUp}
      />
    );
  }

  private _onMouseDown(e: KonvaMouseEvent) {
    const { nodeId, onMouseDown } = this.props;
    if (onMouseDown) {
      onMouseDown(nodeId, e);
    }
  }

  private _onMouseUp(e: KonvaMouseEvent) {
    const { nodeId, onMouseUp } = this.props;
    if (onMouseUp) {
      onMouseUp(nodeId, e);
    }
  }

  private _onMouseOver(e: KonvaMouseEvent) {
    const { nodeId, onMouseOver } = this.props;
    if (onMouseOver) {
      onMouseOver(nodeId, e);
    }
  }

  private _onMouseLeave(e: KonvaMouseEvent) {
    const { nodeId, onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave(nodeId, e);
    }
  }

  private _onPinMouseDown(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    const { nodeId, onPinMouseDown } = this.props;
    if (onPinMouseDown) {
      onPinMouseDown(nodeId, direction, pin, e);
    }
  }

  private _onPinMouseUp(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    const { nodeId, onPinMouseUp } = this.props;
    if (onPinMouseUp) {
      onPinMouseUp(nodeId, direction, pin, e);
    }
  }
}
