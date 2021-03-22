import { EvolutionResult } from "@/logic";

import { EVOLVER_RESPONSE_TIME } from "../constants";
import { EvolverDefinition } from "../types";

const inputMomentaryEvolverDefinition: EvolverDefinition = {
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
            tickOffset: 1 + Math.round(EVOLVER_RESPONSE_TIME * 1.5),
            valuesByPin: { OUT: false },
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
export default inputMomentaryEvolverDefinition;
