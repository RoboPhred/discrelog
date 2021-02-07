import { ElementDefinition } from "../types";

const bufferElementDefinition: ElementDefinition = {
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(state, inputs, tick) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: inputs.IN },
      },
    };
  },
};
export default bufferElementDefinition;
