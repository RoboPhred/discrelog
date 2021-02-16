import { ElementDefinition } from "../types";

const orElementDefinition: ElementDefinition = {
  inputPins: ["A", "B"],
  outputPins: ["OUT"],
  evolve(state, inputs, tick) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: inputs.A || inputs.B },
      },
    };
  },
};
export default orElementDefinition;