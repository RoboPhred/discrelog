import { ElementDefinition } from "./types";

interface ToggleState {
  toggleState: boolean;
}
const defaultToggleState: ToggleState = {
  toggleState: false,
};

const toggleElementDefinition: ElementDefinition = {
  type: "toggle",
  visual: {
    shapePath: {
      path: `M0,0 L0,50 L25,50 L25,0 z`,
      fill: (state: ToggleState) => (state.toggleState ? "green" : "red"),
    },
  },
  pins: {
    OUT: {
      name: "OUT",
      direction: "output",
      x: 25,
      y: 25,
    },
  },
  interact(state: ToggleState = defaultToggleState) {
    return {
      ...state,
      toggleState: !state.toggleState,
    };
  },
  evolve(state = defaultToggleState, inputs, tick) {
    return {
      state,
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: state.toggleState },
      },
    };
  },
};
export default toggleElementDefinition;
