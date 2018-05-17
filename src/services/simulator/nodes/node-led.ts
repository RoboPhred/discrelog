
import { EvolutionResult, NodeDefinition } from "../types";

function genCirclePath(cx: number, cy: number, r: number): string {
    return `M ${cx - r}, ${cy}
    a ${r},${r} 0 1,0 ${(r * 2)},0
    a ${r},${r} 0 1,0 ${-(r * 2)},0`;
}

const ledNodeDefinition: NodeDefinition = {
    type: "led",
    width: 50,
    height: 50,
    shapePath: genCirclePath(25, 25, 25),
    inputs: {
        "IN": {
            name: "IN",
            x: 0,
            y: 25
        }
    },
    outputs: {},
    evolve(state, inputs, tick) {
        return {
            state: {
                value: inputs.IN
            }
        };
    }
}
export default ledNodeDefinition;