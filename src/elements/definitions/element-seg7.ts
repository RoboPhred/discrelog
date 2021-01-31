import { ElementDefinition } from "../types";

const seg7ElementDefinition: ElementDefinition = {
  type: "seg7",
  inputPins: ["A", "B", "C", "D", "E", "F", "G"],
  outputPins: [],
  evolve(state, inputs, tick) {
    return {
      state: { ...inputs },
    };
  },
};
export default seg7ElementDefinition;
