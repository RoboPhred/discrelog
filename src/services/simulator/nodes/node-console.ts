
import { NodeEvolverFunction, EvolutionResult } from "../types";

export const type = "console";
export const inputs = ["IN"];
export const outputs = [];
export const evolve: NodeEvolverFunction = (state, inputs, tick) => {
    console.log("Node input changed to", inputs.IN);
    const result: EvolutionResult = {}
    return result;
}
