import { MaybeArray } from "@/arrays";
import { PinDirection } from "@/logic";
import { AppState } from "@/store";

import { SimProduction } from "./element-production";

import { ElementVisualDefinition } from "./visual";

export type ElementDefinitionSource =
  | MaybeArray<ElementDefinition>
  | ((state: AppState) => MaybeArray<ElementDefinition>);

export interface ElementDefinition {
  type: string;
  category: "logic" | "input-output" | "integrated-circuit";
  displayName: string;
  elementProduction?: SimProduction;
  visual: ElementVisualDefinition;
  pins: Record<string, ElementPinDefinition>;
}

export interface ElementPinDefinition {
  direction: PinDirection;
  x: number;
  y: number;
}
