import * as React from "react";

import { connect } from "react-redux";
import { createSelector, createStructuredSelector } from "reselect";

import { Layer } from "react-konva";

import { interactNode, toggleWireNode, } from "@/services/simulator/actions";
import { isWired } from "@/services/simulator/helpers";

import { State as AppState } from "@/store";

import { moveNode, mouseOverNode } from "../../../actions";

import CircuitElement from "./CircuitElement";

const nodePositionsSelector = (s: AppState) => s.ui.circuitEditor.nodePositions;

interface StateProps {
  nodePositions: ReturnType<typeof nodePositionsSelector>;
}

const mapStateToProps = createStructuredSelector<AppState, StateProps>({
  nodePositions: nodePositionsSelector
});

interface DispatchProps {
  interactNode: typeof interactNode;
  moveNode: typeof moveNode;
  toggleWireNode: typeof toggleWireNode;
  mouseOverNode: typeof mouseOverNode;
}

const mapDispatchToProps = {
  interactNode,
  moveNode,
  toggleWireNode,
  mouseOverNode
};

interface State {
  wireSourceNode: string | null;
  wireSourcePin: string | null;
}

type Props = StateProps & DispatchProps;
class NodesLayer extends React.Component<Props, State> {
  render() {
    const {
      nodePositions,
      interactNode,
      moveNode,
      mouseOverNode
    } = this.props;

    const nodeElements = Object.keys(nodePositions).map(key => {
      const { x, y } = nodePositions[key];
      return (
        <CircuitElement
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
          onClick={interactNode.bind(null, key)}
          onPinClick={this._onPinClick.bind(this, key)}
        />
      );
    });

    return <Layer>{nodeElements}</Layer>;
  }

  private _onPinClick(
    nodeId: string,
    direction: "input" | "output",
    pin: string
  ) {
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
