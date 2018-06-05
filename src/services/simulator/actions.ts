import { Action } from "redux";

import uuidV4 from "uuid/v4";

import { NodeType } from "./node-types";

export const ACTION_EVOLVE = "@sim/evolve" as "@sim/evolve";
export const evolveSim = (tickCount: number) => ({
  type: ACTION_EVOLVE,
  payload: { tickCount }
});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export const ACTION_NODE_ADD = "@sim/node/add" as "@sim/node/add";
// TODO: Including x and y pos in simulator logic, which so far has tried to not concern itself with this.
//  Probably a sign that these actions need to be at a higher level.
export const addNode = (nodeType: NodeType, x?: number, y?: number) => ({
  type: ACTION_NODE_ADD,
  payload: { nodeId: uuidV4(), nodeType, x, y }
});
export type AddNodeAction = ReturnType<typeof addNode>;

export const ACTION_INTERACT = "@sim/interact" as "@sim/interact";
export const interactNode = (nodeId: string) => ({
  type: ACTION_INTERACT,
  payload: { nodeId }
});
export type InteractNodeAction = ReturnType<typeof interactNode>;

export const ACTION_WIRE = "@sim/wire/add" as "@sim/wire/add";
export const wireNode = (
  sourceNodeId: string,
  sourcePin: string,
  targetNodeId: string,
  targetPin: string
) => ({
  type: ACTION_WIRE,
  payload: {
    sourceNodeId,
    sourcePin,
    targetNodeId,
    targetPin
  }
});
export type WireNodeAction = ReturnType<typeof wireNode>;

export const ACTION_UNWIRE = "@sim/wire/remove" as "@sim/wire/remove";
export const unwireNode = (
  sourceNodeId: string,
  sourcePin: string,
  targetNodeId: string,
  targetPin: string
) => ({
  type: ACTION_UNWIRE,
  payload: {
    sourceNodeId,
    sourcePin,
    targetNodeId,
    targetPin
  }
});
export type UnwireNodeAction = ReturnType<typeof unwireNode>;

export const ACTION_TOGGLEWIRE = "@sim/wire/toggle" as "@sim/wire/toggle";
export const toggleWireNode = (
  sourceNodeId: string,
  sourcePin: string,
  targetNodeId: string,
  targetPin: string
) => ({
  type: ACTION_TOGGLEWIRE,
  payload: {
    sourceNodeId,
    sourcePin,
    targetNodeId,
    targetPin
  }
});
export type ToggleWireNodeAction = ReturnType<typeof toggleWireNode>;

export type SimulatorAction =
  | EvolveSimAction
  | AddNodeAction
  | InteractNodeAction
  | WireNodeAction
  | UnwireNodeAction
  | ToggleWireNodeAction;
