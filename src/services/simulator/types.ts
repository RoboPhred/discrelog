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
export interface NodeDefinition {
  type: string;

  // TODO: node appearance and pin positions should be a ui-only concern.
  //  Preferably without splitting it out of the def... Move node defs to its own folder outside
  //  of the service?
  width: number;
  height: number;
  shapePath: string;
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
