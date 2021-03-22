import { EvolverDefinition } from "../types";

const pinHighEvolverDefinition: EvolverDefinition = {
  inputPins: [],
  outputPins: ["OUT"],
  evolve() {
    return {
      transitions: {
        tickOffset: 1,
        valuesByPin: { OUT: true },
      },
    };
  },
};
export default pinHighEvolverDefinition;
