import * as React from "react";

import { connect } from "react-redux";

import { AppState } from "@/store";
import { NodeType } from "@/node-defs";

import { nodeTypesByIdSelector } from "@/services/graph/selectors/nodes";
import { nodeStatesByIdSelector } from "@/services/simulator/selectors/nodes";
import { selectedNodeIdsSelector } from "@/services/selection/selectors/selection";

import NodeVisual, {
  RenderPinProps
} from "@/pages/CircuitEditor/components/NodeVisual";

import CircuitNodePin from "./CircuitNodePin";

export interface CircuitNodeProps {
  nodeId: string;
  x: number;
  y: number;
  onClick?(e: React.MouseEvent): void;
  onMouseDown?(e: React.MouseEvent): void;
  onMouseOver?(e: React.MouseEvent): void;
  onMouseUp?(e: React.MouseEvent): void;
  onMouseLeave?(e: React.MouseEvent): void;
  onPinMouseDown?(pin: string, e: React.MouseEvent): void;
  onPinMouseUp?(pin: string, e: React.MouseEvent): void;
}

interface StateProps {
  nodeType: NodeType;
  nodeState: any;
  isSelected: boolean;
}
function mapStateToProps(state: AppState, props: CircuitNodeProps): StateProps {
  return {
    nodeType: nodeTypesByIdSelector(state)[props.nodeId],
    nodeState: nodeStatesByIdSelector(state)[props.nodeId],
    isSelected: selectedNodeIdsSelector(state).indexOf(props.nodeId) !== -1
  };
}

type Props = CircuitNodeProps & StateProps;
class CircuitNode extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this._renderPin = this._renderPin.bind(this);
  }

  render() {
    const {
      x,
      y,
      nodeType,
      nodeState,
      isSelected,
      onClick,
      onMouseDown,
      onMouseLeave,
      onMouseOver,
      onMouseUp
    } = this.props;

    return (
      <NodeVisual
        x={x}
        y={y}
        nodeType={nodeType}
        nodeState={nodeState}
        onClick={onClick}
        colorOverride={isSelected ? "yellow" : undefined}
        renderPin={this._renderPin}
        onMouseDown={onMouseDown}
        onMouseLeave={onMouseLeave}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
      />
    );
  }

  private _renderPin(props: RenderPinProps): React.ReactElement<any> {
    const { onPinMouseDown, onPinMouseUp } = this.props;
    const { id, x, y } = props;
    return (
      <CircuitNodePin
        key={id}
        nodeId={this.props.nodeId}
        pinId={id}
        x={x}
        y={y}
        onPinMouseDown={onPinMouseDown}
        onPinMouseUp={onPinMouseUp}
      />
    );
  }
}
export default connect(mapStateToProps)(CircuitNode);
