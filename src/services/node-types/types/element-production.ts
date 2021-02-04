import { ElementType } from "@/elements";

export interface NodeElementProductionBase {
  type: string;
}

export interface ElementNodeElementProduction {
  type: "element";
  elementType: ElementType;
}

export interface CircuitNodeElementProduction {
  type: "circuit";
  circuitId: string;
}

export type NodeElementProduction =
  | ElementType
  | ElementNodeElementProduction
  | CircuitNodeElementProduction;
