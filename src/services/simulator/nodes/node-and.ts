
import { EvolutionResult, NodeDefinition } from "../types";

const andNodeDefinition: NodeDefinition = {
    type: "and",
    width: 50,
    height: 50,
    shapePath: `M0,0 L0,50 L50,50 L50,0 z`,
    inputs: {
        "A": {
            name: "A",
            x: 0,
            y: 16.66
        },
        "B": {
            name: "B",
            x: 0,
            y: 33.33
        }
    },
    outputs: {
        "OUT": {
            name: "OUT",
            x: 50,
            y: 25
        }
    },
    evolve(state, inputs, tick) {
        const result: EvolutionResult = {
            transitions: [{
                outputId: "OUT",
                tickOffset: 4,
                value: inputs.A && inputs.B
            }]
        }
        return result;
    }
}
export default andNodeDefinition;