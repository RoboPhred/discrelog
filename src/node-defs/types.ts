import { IDMap } from "@/types";

export type NodePinDirection = "input" | "output";

export interface NodePinDefinition {
  name: string;
  direction: NodePinDirection;
  x: number;
  y: number;
}
export interface NodeVisualPathDefinition {
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
export type NodeVisualPath = string | NodeVisualPathDefinition;
export interface NodeVisualDefinition {
  /**
   * Optional SVG path string defining the hit detection of the node.
   */
  hitPath?: string;
  /**
   * The path or paths that make up the visual component of this node.
   */
  shapePath: NodeVisualPath | NodeVisualPath[];
}

export interface OutputTransition {
  tickOffset: number;
  value: boolean;
}

export interface EvolutionResult {
  state?: any;
  transitions?: IDMap<OutputTransition>;
}

export type NodeInteractFunction = (state: any) => any;
export type NodeEvolverFunction = (
  state: any,
  inputs: Record<string, boolean>,
  tick: number
) => EvolutionResult;

export interface NodeDefinition {
  type: string;

  visual: NodeVisualDefinition;

  pins: IDMap<NodePinDefinition>;

  interact?: NodeInteractFunction;
  evolve?: NodeEvolverFunction;
}
