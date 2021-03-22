import { EVOLVER_RESPONSE_TIME } from "../constants";
import { EvolverDefinition } from "../types";

const logicBufferEvolverDefinition: EvolverDefinition = {
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: EVOLVER_RESPONSE_TIME,
        valuesByPin: { OUT: inputs.IN },
      },
    };
  },
};
export default logicBufferEvolverDefinition;
