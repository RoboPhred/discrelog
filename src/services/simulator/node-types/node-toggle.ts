import { NodeDefinition } from "./types";

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
      fill: (state: ToggleState) => (state.toggleState ? "green" : "red")
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
    return {
      ...state,
      toggleState: !state.toggleState
    };
  },
  evolve(state, inputs, tick) {
    return {
      transitions: [
        {
          tickOffset: 1,
          outputId: "OUT",
          value: state.toggleState
        }
      ]
    };
  }
};
export default toggleSwitchNodeDefinition;
