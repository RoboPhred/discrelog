import { EvolverDefinition } from "../types";

export interface ToggleEvolverState {
  toggleState: boolean;
}
const defaultToggleState: ToggleEvolverState = {
  toggleState: false,
};

const inputToggleEvolverDefinition: EvolverDefinition = {
  inputPins: [],
  outputPins: ["OUT"],
  interact(state: ToggleEvolverState = defaultToggleState) {
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
  evolve: (state: ToggleEvolverState = defaultToggleState) => {
    return {
      state,
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: state.toggleState },
      },
    };
  },
};
export default inputToggleEvolverDefinition;
