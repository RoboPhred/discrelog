import { EVOLVER_RESPONSE_TIME } from "../constants";
import { EvolverDefinition } from "../types";

const logicOrEvolverDefinition: EvolverDefinition = {
  inputPins: ["A", "B"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: EVOLVER_RESPONSE_TIME,
        valuesByPin: { OUT: inputs.A || inputs.B },
      },
    };
  },
};
export default logicOrEvolverDefinition;
