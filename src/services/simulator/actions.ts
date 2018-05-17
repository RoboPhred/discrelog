import { Action } from "redux";

export const ACTION_EVOLVE = "@sim/evolve" as "@sim/evolve";
export const evolveSim = (tickCount: number) => ({type: ACTION_EVOLVE, payload: {tickCount}});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export const ACTION_INTERACT = "@sim/interact" as "@sim/interact";
export const interactNode = (nodeId: string) => ({type: ACTION_INTERACT, payload: {nodeId}});
export type InteractNodeAction = ReturnType<typeof interactNode>;

export const ACTION_WIRE = "@sim/wire" as "@sim/wire";
export const wireNode = (sourceNodeId: string, sourcePin: string, targetNodeId: string, targetPin: string) => ({
    type: ACTION_WIRE,
    payload: {
        sourceNodeId,
        sourcePin,
        targetNodeId,
        targetPin
    }
});
export type WireNodeAction = ReturnType<typeof wireNode>;

export const ACTION_UNWIRE = "@sim/unwire" as "@sim/unwire";
export const unwireNode = (sourceNodeId: string, sourcePin: string, targetNodeId: string, targetPin: string) => ({
    type: ACTION_UNWIRE,
    payload: {
        sourceNodeId,
        sourcePin,
        targetNodeId,
        targetPin
    }
});
export type UnwireNodeAction = ReturnType<typeof unwireNode>;

export type Actions = 
    EvolveSimAction
    | InteractNodeAction
    | WireNodeAction
    | UnwireNodeAction;
