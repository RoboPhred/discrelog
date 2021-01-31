import { ElementDefinition } from "../types";

// Shape path from https://commons.wikimedia.org/wiki/File:Buffer_ANSI.svg

const bufferElementDefinition: ElementDefinition = {
  type: "buffer",
  inputPins: ["IN"],
  outputPins: ["OUT"],
  evolve(state, inputs, tick) {
    return {
      transitions: {
        tickOffset: 4,
        valuesByPin: { OUT: inputs.IN },
      },
    };
  },
};
export default bufferElementDefinition;
