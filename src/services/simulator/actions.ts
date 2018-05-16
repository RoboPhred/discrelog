import { Action } from "redux";

export const ACTION_INTERACT = "@sim/interact" as "@sim/interact";
export const interactSim = (nodeId: string) => ({type: ACTION_INTERACT, payload: {nodeId}});
export type InteractSimAction = ReturnType<typeof interactSim>;

export const ACTION_EVOLVE = "@sim/evolve" as "@sim/evolve";
export const evolveSim = (tickCount: number) => ({type: ACTION_EVOLVE, payload: {tickCount}});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export const ACTION_WIRE = "@sim/wire" as "@sim/wire";
export const wireNode = (sourceNodeId: string, sourceOutput: string, targetNodeId: string, targetInput: string) => ({
    type: ACTION_WIRE,
    payload: {
        sourceNodeId,
        sourceOutput,
        targetNodeId,
        targetInput
    }
});
export type WireNodeAction = ReturnType<typeof wireNode>;

export const ACTION_UNWIRE = "@sim/unwire" as "@sim/unwire";
export const unwireNode = (sourceNodeId: string, sourceOutput: string, targetNodeId: string, targetInput: string) => ({
    type: ACTION_UNWIRE,
    payload: {
        sourceNodeId,
        sourceOutput,
        targetNodeId,
        targetInput
    }
});
export type UnwireNodeAction = ReturnType<typeof unwireNode>;

export type Actions = 
    InteractSimAction
    | EvolveSimAction
    | WireNodeAction
    | UnwireNodeAction;
