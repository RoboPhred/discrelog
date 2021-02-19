import { ElementDefinition } from "../types";

const notElementDefinition: ElementDefinition = {
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: !inputs.IN },
      },
    };
  },
};
export default notElementDefinition;
