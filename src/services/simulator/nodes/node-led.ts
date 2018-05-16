
import { NodeEvolverFunction, EvolutionResult } from "../types";

export const type = "led";
export const inputs = ["IN"];
export const outputs = [];
export const evolve: NodeEvolverFunction = (state, inputs, tick) => {
    return {
        state: {
            value: inputs.IN
        }
    };
}
