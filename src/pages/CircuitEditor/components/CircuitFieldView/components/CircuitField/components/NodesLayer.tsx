import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { AppState } from "@/store";
import { nodePositionsByIdSelector } from "@/services/field/selectors/positions";

import CircuitNode from "./CircuitNode";

export interface NodesLayerProps {
  onNodeMouseDown?(node: string, e: React.MouseEvent): void;
  onNodeMouseUp?(node: string, e: React.MouseEvent): void;
  onNodeMouseOver?(node: string, e: React.MouseEvent): void;
  onNodeMouseLeave?(node: string, e: React.MouseEvent): void;
  onNodePinMouseDown?(nodeId: string, pinId: string, e: React.MouseEvent): void;
  onNodePinMouseUp?(nodeId: string, pinId: string, e: React.MouseEvent): void;
}

const stateSelectors = {
  nodePositionsById: nodePositionsByIdSelector
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

    return <g id="nodes-layer">{nodeElements}</g>;
  }

  private _onPinMouseDown(nodeId: string, pin: string, e: React.MouseEvent) {
    e.stopPropagation();

    const { onNodePinMouseDown } = this.props;
    if (onNodePinMouseDown) {
      onNodePinMouseDown(nodeId, pin, e);
    }
  }

  private _onPinMouseUp(nodeId: string, pin: string, e: React.MouseEvent) {
    const { onNodePinMouseUp } = this.props;
    if (onNodePinMouseUp) {
      onNodePinMouseUp(nodeId, pin, e);
    }
  }
}
export default connect(mapStateToProps)(NodesLayer);

interface BoundCicrcuitNodeProps {
  nodeId: string;
  x: number;
  y: number;
  // TODO: Passing these down the hierarchy is silly.
  //  Some of them can be handled in their originating element
  //  with their own event actions.
  onMouseDown?(nodeId: string, e: React.MouseEvent): void;
  onMouseUp?(nodeId: string, e: React.MouseEvent): void;
  onMouseOver?(nodeId: string, e: React.MouseEvent): void;
  onMouseLeave?(nodeId: string, e: React.MouseEvent): void;
  onPinMouseDown?(nodeId: string, pin: string, e: React.MouseEvent): void;
  onPinMouseUp?(nodeId: string, pin: string, e: React.MouseEvent): void;
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
    const { nodeId, x, y } = this.props;
    return (
      <CircuitNode
        nodeId={nodeId}
        x={x}
        y={y}
        onMouseDown={this._onMouseDown}
        onMouseUp={this._onMouseUp}
        onMouseOver={this._onMouseOver}
        onMouseLeave={this._onMouseLeave}
        onPinMouseDown={this._onPinMouseDown}
        onPinMouseUp={this._onPinMouseUp}
      />
    );
  }

  private _onMouseDown(e: React.MouseEvent) {
    const { nodeId, onMouseDown } = this.props;
    if (onMouseDown) {
      onMouseDown(nodeId, e);
    }
  }

  private _onMouseUp(e: React.MouseEvent) {
    const { nodeId, onMouseUp } = this.props;
    if (onMouseUp) {
      onMouseUp(nodeId, e);
    }
  }

  private _onMouseOver(e: React.MouseEvent) {
    const { nodeId, onMouseOver } = this.props;
    if (onMouseOver) {
      onMouseOver(nodeId, e);
    }
  }

  private _onMouseLeave(e: React.MouseEvent) {
    const { nodeId, onMouseLeave } = this.props;
    if (onMouseLeave) {
      onMouseLeave(nodeId, e);
    }
  }

  private _onPinMouseDown(pin: string, e: React.MouseEvent) {
    const { nodeId, onPinMouseDown } = this.props;
    if (onPinMouseDown) {
      onPinMouseDown(nodeId, pin, e);
    }
  }

  private _onPinMouseUp(pin: string, e: React.MouseEvent) {
    const { nodeId, onPinMouseUp } = this.props;
    if (onPinMouseUp) {
      onPinMouseUp(nodeId, pin, e);
    }
  }
}
