import { MaybeArray } from "@/arrays";
import { PinDirection } from "@/logic";
import { AppState } from "@/store";

import { NodeElementProduction } from "./element-production";

import { NodeVisualDefinition } from "./visual";

export type NodeDefinitionSource =
  | MaybeArray<NodeDefinition>
  | ((state: AppState) => MaybeArray<NodeDefinition>);

export interface NodeDefinition {
  type: string;
  category: "logic" | "i/o" | "ic";
  displayName: string;
  elementProduction?: NodeElementProduction;
  visual: NodeVisualDefinition;
  pins: Record<string, NodePinDefinition>;
}

export interface NodePinDefinition {
  direction: PinDirection;
  x: number;
  y: number;
}
