import { NodeInteractFunction } from "../types";

interface ToggleState {
    toggleState: boolean;
}
const defaultToggleState: ToggleState = {
    toggleState: false
};

export const type = "toggle";
export const inputs = [];
export const outputs = ["OUT"];
export const interact: NodeInteractFunction = (state: any = defaultToggleState) => {
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
