import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Rect } from "react-konva";

import { AppState } from "@/store";

import { NodeDefinition, NodeType } from "@/services/simulator/node-types";
import { nodeTypesById, nodeStatesById } from "@/services/simulator/selectors";
import { Node, NodePinDirection } from "@/services/simulator/types";

import { selectedNodeIds } from "@/pages/CircuitEditor/selectors";
import NodeVisual, {
  RenderPinProps
} from "@/pages/CircuitEditor/components/NodeVisual";

import NodePin from "./NodePin";
import { ClipPathProperty } from "csstype";

export interface CircuitNodeProps extends ContainerConfig, KonvaNodeProps {
  nodeId: string;
  onPinClick(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
}

interface StateProps {
  nodeType: NodeType;
  nodeState: any;
  isSelected: boolean;
}
function mapStateToProps(state: AppState, props: CircuitNodeProps): StateProps {
  return {
    nodeType: nodeTypesById(state)[props.nodeId],
    nodeState: nodeStatesById(state)[props.nodeId],
    isSelected: selectedNodeIds(state).indexOf(props.nodeId) !== -1
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
      nodeId,
      nodeType,
      nodeState,
      isSelected,
      onClick,
      onPinClick,
      ...groupProps
    } = this.props;

    return (
      <Group {...groupProps}>
        <NodeVisual
          nodeType={nodeType}
          nodeState={nodeState}
          onClick={onClick}
          renderPin={this._renderPin}
        />
        {isSelected && <Rect width={10} height={10} fill="yellow" />}
      </Group>
    );
  }

  private _renderPin(props: RenderPinProps): React.ReactElement<any> {
    return (
      <CircuitNodePin
        key={props.id}
        onPinClick={this.props.onPinClick}
        {...props}
      />
    );
  }
}
export default connect(mapStateToProps)(CircuitNode);

type CircuitNodePinProps = RenderPinProps & {
  onPinClick?(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
};
class CircuitNodePin extends React.Component<CircuitNodePinProps> {
  constructor(props: CircuitNodePinProps) {
    super(props);

    this._onClick = this._onClick.bind(this);
  }

  render() {
    const { x, y } = this.props;
    return <NodePin x={x} y={y} onClick={this._onClick} />;
  }

  private _onClick(e: KonvaMouseEvent) {
    const { direction, id, onPinClick } = this.props;
    if (onPinClick) {
      onPinClick(direction, id, e);
    }
  }
}
