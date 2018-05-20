import * as React from "react";

import { connect } from "react-redux";

import { ContainerConfig } from "konva";
import { KonvaNodeProps, Group, Rect, Line, Path } from "react-konva";

import { Node } from "@/services/simulator/types";
import { NodeTypes, NodeVisualPath, NodeVisualPathDefinition } from "@/services/simulator/node-types";
import { State } from "@/store";

import NodeVisual from "../../NodeVisual";

interface BodyProps extends ContainerConfig, KonvaNodeProps {
  nodeId: string;
  onClick(): void;
}

interface StateProps {
  node: Node;
  nodeState: any;
}
function mapStateToProps(state: State, props: BodyProps) {
  const { nodeId } = props;
  const simState = state.services.simulator;
  return {
    node: simState.nodes[nodeId],
    nodeState: simState.nodeStates[nodeId]
  };
}

type Props = BodyProps & StateProps;
class Body extends React.Component<Props> {
  render() {
    const {
      nodeId,
      node: { type },
      nodeState,
      onClick,
      ...groupProps
    } = this.props;

    let bodyElement: React.ReactChild;
    const def = NodeTypes[type];
    if (def) {
      bodyElement = (
        <NodeVisual
          visual={def.visual}
          state={nodeState}
          onClick={onClick}
        />
      )
    } else {
      bodyElement = (
        <Rect
          x={0}
          y={0}
          width={25}
          height={25}
          fill="black"
          onClick={onClick}
        />
      );
    }

    return (
      <Group {...groupProps}>
        {bodyElement}
      </Group>
    );
  }
}

export default connect(mapStateToProps)(Body);
