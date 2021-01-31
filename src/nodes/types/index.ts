export * from "./visual";

import { ElementType, PinDirection } from "@/elements";
import { Point } from "@/geometry";

import { NodeVisualDefinition } from "./visual";

export interface NodeDefinition {
  type: string;
  elementType: ElementType;
  visual: NodeVisualDefinition;
  pins: Record<string, NodePinDefinition>;
}

export interface NodePinDefinition {
  direction: PinDirection;
  x: number;
  y: number;
}
