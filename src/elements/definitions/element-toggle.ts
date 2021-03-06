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
    const nextState = !state.toggleState;
    return {
      state: Object.assign({}, state, {
        toggleState: nextState,
      }),
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: nextState },
      },
    };
  },
  evolve: (state: ToggleElementState = defaultToggleState) => {
    return {
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: state.toggleState },
      },
    };
  },
};
export default toggleElementDefinition;
