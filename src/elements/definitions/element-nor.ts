import { ELEMENT_TRANSISTER_RESPONSE_TIME } from "../constants";
import { ElementDefinition } from "../types";

const norElementDefinition: ElementDefinition = {
  inputPins: ["A", "B"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: ELEMENT_TRANSISTER_RESPONSE_TIME,
        valuesByPin: { OUT: !(inputs.A || inputs.B) },
      },
    };
  },
};
export default norElementDefinition;
