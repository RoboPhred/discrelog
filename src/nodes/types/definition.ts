import { ElementType } from "@/elements";
import { PinDirection } from "@/logic";

import { NodeVisualDefinition } from "./visual";

export interface NodeDefinition {
  type: string;
  elementProduction?: NodeElementProduction;
  visual: NodeVisualDefinition;
  pins: Record<string, NodePinDefinition>;
}

export interface NodePinDefinition {
  direction: PinDirection;
  x: number;
  y: number;
}

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
