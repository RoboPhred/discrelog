
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
export type NodeEvolverFunction = (state: any, inputs: InputValueMap, tick: number) => EvolutionResult;

export interface NodeDefinition {
    type: string;
    inputs: string[];
    outputs: string[];
    interact?: NodeInteractFunction;
    evolve?: NodeEvolverFunction;
}

export interface Node {
    id: string;
    type: NodeType;
    inputConnectionsByPin: {
        [key: string]: PinConnection | null;
    }
    outputConnectionsByPin: {
        [key: string]: PinConnection[];
    }
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
