import { EvolverDefinition } from "../types";

const outputSeg7EvolverDefinition: EvolverDefinition = {
  inputPins: ["A", "B", "C", "D", "E", "F", "G"],
  outputPins: [],
  evolve(_, inputs) {
    return {
      state: { ...inputs },
    };
  },
};
export default outputSeg7EvolverDefinition;
