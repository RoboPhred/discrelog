import { ElementDefinition } from "../types";

export interface LedElementState {
  value: boolean;
}

const ledElementDefinition: ElementDefinition = {
  inputPins: ["IN"],
  outputPins: [],
  evolve(_, inputs) {
    return {
      state: {
        value: inputs.IN,
      },
    };
  },
};
export default ledElementDefinition;
