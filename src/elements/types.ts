import { ElementEvolverFunction, ElementInteractFunction } from "@/logic";

export interface ElementDefinition {
  type: string;

  inputPins: string[];

  // Used for presetting all outputs to false on init.
  // Could remove this if we assume an undefined pin is false.
  outputPins: string[];

  interact?: ElementInteractFunction;
  evolve?: ElementEvolverFunction;
}
