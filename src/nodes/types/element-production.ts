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

export type NodeElementProductionObject =
  | ElementNodeElementProduction
  | CircuitNodeElementProduction;

export type NodeElementProduction = ElementType | NodeElementProductionObject;

export function normalizeElementProduction(
  elementProduction: NodeElementProduction
): NodeElementProductionObject {
  if (typeof elementProduction === "string") {
    return {
      type: "element",
      elementType: elementProduction,
    };
  }

  return elementProduction;
}
