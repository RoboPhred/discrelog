import { addNode as simulatorAddNode } from "@/services/simulator/actions/node-add";
import { NodeType } from "@/services/simulator/node-types";

export { ACTION_NODE_ADD } from "@/services/simulator/actions/node-add";
export const addNode = (
  nodeType: NodeType,
  x: number,
  y: number,
  nodeId?: string
) => {
  const simAddNode = simulatorAddNode(nodeType, nodeId);
  return {
    ...simAddNode,
    payload: {
      ...simAddNode.payload,
      x,
      y
    }
  };
};
export type AddNodeAction = ReturnType<typeof addNode>;
