import { EvolutionResult } from "@/logic";

export interface EvolverDefinition {
  inputPins: string[];

  // Used for presetting all outputs to false on init.
  // Could remove this if we assume an undefined pin is false.
  outputPins: string[];

  interact?: EvolverInteractFunction;
  evolve?: EvolverEvolveFunction;
}

export type EvolverInteractFunction = (
  state: any,
  data: any
) => EvolutionResult;
export type EvolverEvolveFunction = (
  state: any,
  inputs: Record<string, boolean>,
  tick: number
) => EvolutionResult;
