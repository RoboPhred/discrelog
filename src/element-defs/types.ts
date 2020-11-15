import { IDMap, MaybeArray } from "@/types";

export type PinDirection = "input" | "output";

export interface ElementPinDefinition {
  name: string;
  direction: PinDirection;
  x: number;
  y: number;
}
export interface ElementVisualPathDefinition {
  /**
   * The svg path of this visual element.
   */
  path: string;
  /**
   * The fill or fill-producing function for this visual element.
   */
  fill?: string | ((state: any) => string);
  stroke?: string | ((state: any) => string);
  strokeWidth?: number | ((state: any) => number);
}
export type ElementVisualPath = string | ElementVisualPathDefinition;
export interface ElementVisualDefinition {
  /**
   * Optional SVG path string defining the hit detection of the node.
   */
  hitPath?: string;
  /**
   * The path or paths that make up the visual component of this node.
   */
  shapePath: ElementVisualPath | ElementVisualPath[];
}

export interface OutputTransition {
  /**
   * The offset from the current tick to execute this transition.
   */
  tickOffset: number;
  /**
   * A map of values by pin output to transition to.
   * Pins not specified will mantain their original value.
   */
  valuesByPin: IDMap<boolean>;
  /**
   * How to handle other scheduled transitions on this node.
   * - replace: This transition will replace other transitions on this node.
   * - append: This transition will be scheduled in addition to previous transitions.
   *
   * Default: replace
   */
  transitionMerger?: "replace" | "append";
}

export interface EvolutionResult {
  /**
   * The new node state to use.
   */
  state?: any;
  /**
   * Pin value changes to schedule.
   */
  transitions?: MaybeArray<OutputTransition>;
}

export type ElementInteractFunction = (state: any) => any;
export type ElementEvolverFunction = (
  state: any,
  inputs: Record<string, boolean>,
  tick: number
) => EvolutionResult;

export interface ElementDefinition {
  type: string;

  visual: ElementVisualDefinition;

  pins: IDMap<ElementPinDefinition>;

  interact?: ElementInteractFunction;
  evolve?: ElementEvolverFunction;
}
