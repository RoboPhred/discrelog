import { ElementDefinition } from "../types";

const norElementDefinition: ElementDefinition = {
  inputPins: ["A", "B"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: !(inputs.A || inputs.B) },
      },
    };
  },
};
export default norElementDefinition;
