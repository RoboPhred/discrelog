
import { NodeEvolverFunction, EvolutionResult } from "../types";

export const type = "and";
export const inputs = ["A", "B"];
export const outputs = ["OUT"];
export const evolve: NodeEvolverFunction = (state, inputs, tick) => {
    const result: EvolutionResult = {
        transitions: [{
            outputId: "OUT",
            tickOffset: 4,
            value: inputs.A && inputs.B
        }]
    }
    return result;
}
