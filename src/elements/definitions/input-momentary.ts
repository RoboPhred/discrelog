import { EvolutionResult } from "@/logic";

import { ELEMENT_TRANSISTER_RESPONSE_TIME } from "../constants";
import { ElementDefinition } from "../types";

const inputMomentaryElementDefinition: ElementDefinition = {
  inputPins: [],
  outputPins: ["OUT"],
  interact(state: any, data: any): EvolutionResult {
    if (data === undefined) {
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
    } else if (data) {
      return {
        transitions: {
          tickOffset: 1,
          valuesByPin: { OUT: true },
        },
      };
    } else {
      return {
        transitions: {
          tickOffset: 1,
          valuesByPin: { OUT: false },
        },
      };
    }
  },
};
export default inputMomentaryElementDefinition;
