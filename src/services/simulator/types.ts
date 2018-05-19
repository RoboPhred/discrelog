import { NodeType } from "./nodes";

export interface InputValueMap {
  [key: string]: boolean;
}

export interface OutputTransition {
  tickOffset: number;
  outputId: string;
  value: boolean;
}

export interface EvolutionResult {
  state?: any;
  transitions?: OutputTransition[];
}

export type NodeInteractFunction = (state: any) => EvolutionResult;
export type NodeEvolverFunction = (
  state: any,
  inputs: InputValueMap,
  tick: number
) => EvolutionResult;

export interface NodePinDefinition {
  name: string;
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
};

export interface NodeDefinition {
  type: string;

  // TODO: node appearance and pin positions should be a ui-only concern.
  //  Preferably without splitting it out of the def... Move node defs to its own folder outside
  //  of the service?
  visual: NodeVisualDefinition;

  inputs: { [key: string]: NodePinDefinition };
  outputs: { [key: string]: NodePinDefinition };

  interact?: NodeInteractFunction;
  evolve?: NodeEvolverFunction;
}

export interface Node {
  id: string;
  type: NodeType;
  inputConnectionsByPin: {
    [key: string]: PinConnection | null;
  };
  outputConnectionsByPin: {
    [key: string]: PinConnection[];
  };
}

export interface NodesById {
  [key: string]: Node;
}

export interface PinConnection {
  nodeId: string;
  pin: string;
}

export interface PendingTransition {
  nodeId: string;
  outputPinId: string;
  value: boolean;
}
