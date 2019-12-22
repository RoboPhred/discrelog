import { AnyAction } from "redux";

import { NodeType } from "@/node-defs";

import {
  addNode as simulatorAddNode,
  ACTION_NODE_ADD
} from "@/services/simulator/actions/node-add";

// TODO: Rather than hyjacking the existing action, make this its own distinct
//  action and invoke the simulator action in the reducer.
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
export function isAddNodeAction(action: AnyAction): action is AddNodeAction {
  return action.type === ACTION_NODE_ADD;
}
