import { Action } from "redux";

export const ACTION_INTERACT = "@sim/interact" as "@sim/interact";
export const interactSim = (nodeId: string) => ({type: ACTION_INTERACT, payload: {nodeId}});
export type InteractSimAction = ReturnType<typeof interactSim>;

export const ACTION_EVOLVE = "@sim/evolve" as "@sim/evolve";
export const evolveSim = (tickCount: number) => ({type: ACTION_EVOLVE, payload: {tickCount}});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export type Actions = InteractSimAction | EvolveSimAction;
