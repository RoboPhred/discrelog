import uuidV4 from "uuid/v4";

import { NodeType } from "./node-types";
import { NodePin } from "./types";

export const ACTION_EVOLVE = "@sim/evolve" as const;
export const evolveSim = (tickCount: number) => ({
  type: ACTION_EVOLVE,
  payload: { tickCount }
});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export const ACTION_FASTFORWARD = "@sim/fastforward" as const;
export const fastForwardSim = () => ({
  type: ACTION_FASTFORWARD
});
export type FastForwardSimAction = ReturnType<typeof fastForwardSim>;

export const ACTION_NODE_ADD = "@sim/node/add" as const;
export const addNode = (nodeType: NodeType, nodeId?: string) => ({
  type: ACTION_NODE_ADD,
  payload: { nodeId: nodeId || uuidV4(), nodeType }
});
export type AddNodeAction = ReturnType<typeof addNode>;

export const ACTION_NODE_DELETE = "@sim/node/delete" as const;
export const deleteNode = (nodeId: string | string[]) => ({
  type: ACTION_NODE_DELETE,
  payload: { nodeIds: Array.isArray(nodeId) ? nodeId : [nodeId] }
});
export type DeleteNodeAction = ReturnType<typeof deleteNode>;

export const ACTION_NODE_INTERACT = "@sim/node/interact" as const;
export const interactNode = (nodeId: string) => ({
  type: ACTION_NODE_INTERACT,
  payload: { nodeId }
});
export type InteractNodeAction = ReturnType<typeof interactNode>;

export const ACTION_WIRE = "@sim/wire/wire" as const;
export const wireNode = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_WIRE,
  payload: {
    outputPin: {
      nodeId: outputNodeId,
      pin: outputPin
    } as NodePin,
    inputPin: {
      nodeId: inputNodeId,
      pin: inputPin
    } as NodePin
  }
});
export type WireNodeAction = ReturnType<typeof wireNode>;

export const ACTION_UNWIRE = "@sim/wire/unwire" as const;
export const unwireNode = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_UNWIRE,
  payload: {
    outputPin: {
      nodeId: outputNodeId,
      pin: outputPin
    } as NodePin,
    inputPin: {
      nodeId: inputNodeId,
      pin: inputPin
    } as NodePin
  }
});
export type UnwireNodeAction = ReturnType<typeof unwireNode>;

export const ACTION_TOGGLEWIRE = "@sim/wire/toggle" as const;
export const toggleWireNode = (
  outputNodeId: string,
  outputPin: string,
  inputNodeId: string,
  inputPin: string
) => ({
  type: ACTION_TOGGLEWIRE,
  payload: {
    outputPin: {
      nodeId: outputNodeId,
      pin: outputPin
    } as NodePin,
    inputPin: {
      nodeId: inputNodeId,
      pin: inputPin
    } as NodePin
  }
});
export type ToggleWireNodeAction = ReturnType<typeof toggleWireNode>;

export type SimulatorAction =
  | EvolveSimAction
  | FastForwardSimAction
  | AddNodeAction
  | DeleteNodeAction
  | InteractNodeAction
  | WireNodeAction
  | UnwireNodeAction
  | ToggleWireNodeAction;
