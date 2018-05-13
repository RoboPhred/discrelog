
import { NodeEvolverFunction } from "../types";

export const INPUTS = ["A", "B"];
export const OUTPUTS = ["X"];
export const evolve: NodeEvolverFunction = (inputs, tick) => {
    return {
        transitions: [{
            tick: tick + 4,
            output: "X",
            value: inputs["A"] && inputs["B"]
        }]
    };
}
