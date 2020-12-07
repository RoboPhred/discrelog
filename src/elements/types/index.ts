export * from "./logic";
export * from "./visual";

import {
  ElementEvolverFunction,
  ElementInteractFunction,
  ElementPinDefinition,
} from "./logic";

import { ElementVisualDefinition } from "./visual";

export interface ElementDefinition {
  type: string;

  visual: ElementVisualDefinition;

  pins: Record<string, ElementPinDefinition>;

  interact?: ElementInteractFunction;
  evolve?: ElementEvolverFunction;
}
