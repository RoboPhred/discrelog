import * as React from "react";

import { connect } from "react-redux";
import { createSelector, createStructuredSelector } from "reselect";

import { Layer } from "react-konva";

import { interactNode, toggleWireNode } from "@/services/simulator/actions";
import { isWired } from "@/services/simulator/helpers";

import { AppState } from "@/store";

import { moveNode, mouseOverNode } from "../../../actions";

import CircuitNode from "../../CircuitNode";

const nodePositionsSelector = (s: AppState) => s.ui.circuitEditor.nodePositions;

interface StateProps {
  nodePositions: ReturnType<typeof nodePositionsSelector>;
}

const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  nodePositions: nodePositionsSelector
});

const mapDispatchToProps = {
  interactNode,
  moveNode,
  toggleWireNode,
  mouseOverNode
};
type DispatchProps = typeof mapDispatchToProps;

interface State {
  wireSourceNode: string | null;
  wireSourcePin: string | null;
}

type Props = StateProps & DispatchProps;
class NodesLayer extends React.Component<Props, State> {
  render() {
    const { nodePositions, interactNode, moveNode, mouseOverNode } = this.props;

    const nodeElements = Object.keys(nodePositions).map(key => {
      const { x, y } = nodePositions[key];
      return (
        <CircuitNode
          key={key}
          nodeId={key}
          x={x}
          y={y}
          draggable
          onMouseOver={e => {
            mouseOverNode(key);
          }}
          onMouseLeave={e => mouseOverNode(null)}
          onDragMove={e => {
            const pos = e.target.getAbsolutePosition();
            moveNode(key, pos.x, pos.y);
          }}
          onClick={this._onClick.bind(this, key)}
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
    if (e.evt.defaultPrevented) {
      return;
    }
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

  private _onClick(nodeId: string, e: KonvaMouseEvent) {
    if (e.evt.defaultPrevented) {
      return;
    }
    e.evt.preventDefault();

    this.props.interactNode(nodeId);
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NodesLayer);
