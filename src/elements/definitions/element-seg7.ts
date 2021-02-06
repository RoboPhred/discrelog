import { ElementDefinition } from "../types";

const seg7ElementDefinition: ElementDefinition = {
  inputPins: ["A", "B", "C", "D", "E", "F", "G"],
  outputPins: [],
  evolve(state, inputs, tick) {
    return {
      state: { ...inputs },
    };
  },
};
export default seg7ElementDefinition;
