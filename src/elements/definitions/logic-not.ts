import { ELEMENT_TRANSISTER_RESPONSE_TIME } from "../constants";
import { ElementDefinition } from "../types";

const notElementDefinition: ElementDefinition = {
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(_, inputs) {
    return {
      transitions: {
        tickOffset: ELEMENT_TRANSISTER_RESPONSE_TIME,
        valuesByPin: { OUT: !inputs.IN },
      },
    };
  },
};
export default notElementDefinition;
