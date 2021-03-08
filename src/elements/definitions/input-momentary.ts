import { ELEMENT_TRANSISTER_RESPONSE_TIME } from "../constants";
import { ElementDefinition } from "../types";

const inputMomentaryElementDefinition: ElementDefinition = {
  inputPins: [],
  outputPins: ["OUT"],
  interact() {
    return {
      transitions: [
        {
          tickOffset: 1,
          valuesByPin: { OUT: true },
        },
        {
          tickOffset: 1 + Math.round(ELEMENT_TRANSISTER_RESPONSE_TIME * 1.5),
          valuesByPin: { OUT: false },
          transitionMerger: "append",
        },
      ],
    };
  },
};
export default inputMomentaryElementDefinition;
