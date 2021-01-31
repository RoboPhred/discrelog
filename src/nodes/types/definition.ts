import { ElementType } from "@/elements";
import { PinDirection } from "@/logic";

import { NodeVisualDefinition } from "./visual";

export interface NodeDefinition {
  type: string;
  elementType: ElementType;
  visual: NodeVisualDefinition;
  pins: Record<string, NodePinDefinition>;
}

export interface NodePinDefinition {
  // While pin direction seems an element concern at first,
  // a node might represent a collection of elements, and in
  // that case only the node knows if the pin is input or output.
  direction: PinDirection;
  x: number;
  y: number;
}
