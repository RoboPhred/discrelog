import { EvolverDefinition } from "../types";

export interface LedEvolverState {
  value: boolean;
}

const outputLedEvolverDefinition: EvolverDefinition = {
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
export default outputLedEvolverDefinition;
