import { ElementDefinition } from "../types";

const notElementDefinition: ElementDefinition = {
  type: "not",
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(state, inputs, tick) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: !inputs.IN },
      },
    };
  },
};
export default notElementDefinition;
