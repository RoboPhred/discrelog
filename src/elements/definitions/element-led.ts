import { ElementDefinition } from "../types";

export interface LedElementState {
  value: boolean;
}

const ledElementDefinition: ElementDefinition = {
  inputPins: ["IN"],
  outputPins: [],
  evolve(state: LedElementState, inputs, tick) {
    return {
      state: {
        value: inputs.IN,
      },
    };
  },
};
export default ledElementDefinition;
