import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { ContainerConfig } from "konva";
import { Layer, KonvaNodeProps } from "react-konva";

import { toggleWireNode } from "@/services/simulator/actions";
import { NodePinDirection } from "@/services/simulator/types";

import { AppState } from "@/store";

import { nodePositionsById } from "@/pages/CircuitEditor/selectors";

import CircuitNode from "./CircuitNode";

export interface NodesLayerProps {
  onNodeMouseDown?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseUp?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseOver?(node: string, e: KonvaMouseEvent): void;
  onNodeMouseLeave?(node: string, e: KonvaMouseEvent): void;
}

interface StateProps {
  nodePositionsById: ReturnType<typeof nodePositionsById>;
}

const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  nodePositionsById
});

const mapDispatchToProps = {
  toggleWireNode
};
type DispatchProps = typeof mapDispatchToProps;

interface State {
  wireSourceNode: string | null;
  wireSourcePin: string | null;
}

type Props = NodesLayerProps & StateProps & DispatchProps;
class NodesLayer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this._onPinClick = this._onPinClick.bind(this);
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
          onPinClick={this._onPinClick}
        />
      );
    });

    return <Layer>{nodeElements}</Layer>;
  }

  private _onPinClick(
    nodeId: string,
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    e.evt.preventDefault();

    if (direction === "output") {
      this.setState({
        wireSourceNode: nodeId,
        wireSourcePin: pin
      });
      return;
    }

    const { wireSourceNode, wireSourcePin } = this.state;
    if (!wireSourceNode || !wireSourcePin) {
      return;
    }

    this.props.toggleWireNode(wireSourceNode, wireSourcePin, nodeId, pin);

    this.setState({
      wireSourceNode: null,
      wireSourcePin: null
    });
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NodesLayer);

interface BoundCicrcuitNodeProps extends ContainerConfig {
  nodeId: string;
  onMouseDown?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseUp?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseOver?(nodeId: string, e: KonvaMouseEvent): void;
  onMouseLeave?(nodeId: string, e: KonvaMouseEvent): void;
  onPinClick?(
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
    this._onPinClick = this._onPinClick.bind(this);
  }
  render() {
    const {
      onMouseDown,
      onMouseUp,
      onMouseOver,
      onMouseLeave,
      onPinClick,
      ...otherProps
    } = this.props;
    return (
      <CircuitNode
        {...otherProps}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseOver={this._onMouseOver}
        onMouseLeave={this._onMouseLeave}
        onPinClick={this._onPinClick}
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

  private _onPinClick(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ) {
    const { nodeId, onPinClick } = this.props;
    if (onPinClick) {
      onPinClick(nodeId, direction, pin, e);
    }
  }
}
