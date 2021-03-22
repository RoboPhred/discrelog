import { EvolverType } from "@/evolvers";

export interface ElementSimProduction {
  type: "element";
  evolverType: EvolverType;
}

export interface CircuitSimProduction {
  type: "circuit";
  circuitId: string;
}

export type SimProductionObject = ElementSimProduction | CircuitSimProduction;

export type SimProduction = EvolverType | SimProductionObject;

export function normalizeSimProduction(
  simProduction: SimProduction
): SimProductionObject {
  if (typeof simProduction === "string") {
    return {
      type: "element",
      evolverType: simProduction,
    };
  }

  return simProduction;
}
