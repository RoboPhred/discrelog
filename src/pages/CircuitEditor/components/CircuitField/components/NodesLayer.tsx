import * as React from "react";

import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { Layer } from "react-konva";

import { toggleWireNode } from "@/services/simulator/actions";

import { AppState } from "@/store";

import { nodePositionsById } from "@/pages/CircuitEditor/selectors";

import CircuitNode from "../../CircuitNode";

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
        <CircuitNode
          key={key}
          nodeId={key}
          x={x}
          y={y}
          onMouseDown={
            onNodeMouseDown ? onNodeMouseDown.bind(null, key) : undefined
          }
          onMouseUp={onNodeMouseUp ? onNodeMouseUp.bind(null, key) : undefined}
          onMouseOver={
            onNodeMouseOver ? onNodeMouseOver.bind(null, key) : undefined
          }
          onMouseLeave={
            onNodeMouseLeave ? onNodeMouseLeave.bind(null, key) : undefined
          }
          onPinClick={this._onPinClick.bind(this, key)}
        />
      );
    });

    return <Layer>{nodeElements}</Layer>;
  }

  private _onPinClick(
    nodeId: string,
    direction: "input" | "output",
    pin: string,
    e: KonvaMouseEvent
  ) {
    // TODO: Untangle this from mouse logic in CircuitField
    // if (e.evt.defaultPrevented) {
    //   return;
    // }
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
