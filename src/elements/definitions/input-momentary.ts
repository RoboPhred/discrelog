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
          tickOffset: 5,
          valuesByPin: { OUT: false },
          transitionMerger: "append",
        },
      ],
    };
  },
};
export default inputMomentaryElementDefinition;
