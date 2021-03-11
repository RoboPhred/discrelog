import { ElementDefinition } from "../types";

const pinHighElementDefinition: ElementDefinition = {
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
export default pinHighElementDefinition;
