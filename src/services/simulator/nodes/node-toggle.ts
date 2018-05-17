import { NodeDefinition } from "../types";

interface ToggleState {
    toggleState: boolean;
}
const defaultToggleState: ToggleState = {
    toggleState: false
};

const toggleSwitchNodeDefinition: NodeDefinition = {
    type: "toggle",
    width: 25,
    height: 50,
    shapePath: `M0,0 L0,50 L25,50 L25,0 z`,
    inputs: {},
    outputs: {
        "OUT": {
            name: "OUT",
            x: 25,
            y: 25
        }
    },
    interact(state: ToggleState = defaultToggleState) {
        const toggleState = !state.toggleState;
        return {
            state: {
                toggleState
            },
            transitions: [{
                outputId: "OUT",
                tickOffset: 4,
                value: toggleState
            }]
        };
    }
}
export default toggleSwitchNodeDefinition;