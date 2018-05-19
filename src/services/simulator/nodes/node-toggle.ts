import { NodeDefinition } from "../types";

interface ToggleState {
  toggleState: boolean;
}
const defaultToggleState: ToggleState = {
  toggleState: false
};

const toggleSwitchNodeDefinition: NodeDefinition = {
  type: "toggle",
  visual: {
    shapePath: {
      path: `M0,0 L0,50 L25,50 L25,0 z`,
      fill: (state: ToggleState) => state.toggleState ? "green" : "red"
    }
  },
  inputs: {},
  outputs: {
    OUT: {
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
      transitions: [
        {
          outputId: "OUT",
          tickOffset: 4,
          value: toggleState
        }
      ]
    };
  }
};
export default toggleSwitchNodeDefinition;
