import { ElementDefinition } from "../types";

export interface ToggleElementState {
  toggleState: boolean;
}
const defaultToggleState: ToggleElementState = {
  toggleState: false,
};

const toggleElementDefinition: ElementDefinition = {
  inputPins: [],
  outputPins: ["OUT"],
  interact(state: ToggleElementState = defaultToggleState) {
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
