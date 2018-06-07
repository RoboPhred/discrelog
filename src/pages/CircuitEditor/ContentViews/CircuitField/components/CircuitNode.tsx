import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Rect } from "react-konva";

import { AppState } from "@/store";

import { NodeType } from "@/services/simulator/node-types";
import { nodeTypesById, nodeStatesById } from "@/services/simulator/selectors";
import { NodePinDirection } from "@/services/simulator/types";

import { selectedNodeIds } from "@/pages/CircuitEditor/selectors";
import NodeVisual, {
  RenderPinProps
} from "@/pages/CircuitEditor/components/NodeVisual";

import CircuitNodePin from "./CircuitNodePin";

export interface CircuitNodeProps extends ContainerConfig, KonvaNodeProps {
  nodeId: string;
  onPinMouseDown?(
    direction: NodePinDirection,
    pin: string,
    e: KonvaMouseEvent
  ): void;
  onPinMouseUp?(
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
      // Pull out all of our props to avoid passing them to group.
      nodeId,
      nodeType,
      nodeState,
      isSelected,
      onClick,
      onPinMouseDown,
      onPinMouseUp,
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
    const { onPinMouseDown, onPinMouseUp } = this.props;
    const { id, ...pinProps } = props;
    return (
      <CircuitNodePin
        key={id}
        nodeId={this.props.nodeId}
        pinId={id}
        onPinMouseDown={onPinMouseDown}
        onPinMouseUp={onPinMouseUp}
        {...pinProps}
      />
    );
  }
}
export default connect(mapStateToProps)(CircuitNode);
