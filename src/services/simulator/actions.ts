import { Action } from "redux";

export const ACTION_EVOLVE = "@sim/evolve" as "@sim/evolve";
export const evolveSim = (ticks: number) => ({type: ACTION_EVOLVE, payload: {ticks}});
export type EvolveSimAction = ReturnType<typeof evolveSim>;

export type Actions = EvolveSimAction;
