
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
    inputs: {[key: string]: NodePinDefinition};
    outputs: {[key: string]: NodePinDefinition};

    interact?: NodeInteractFunction;
    evolve?: NodeEvolverFunction;
}

export interface Node {
    id: string;
    type: NodeType;
    inputEdgeIds: {
        [key: string]: string | null;
    }
    outputEdgeIds: {
        [key: string]: string | null;
    }
}

export interface EdgeConnection {
    nodeId: string;
    port: string;
}
export interface Edge {
    id: string;
    source: EdgeConnection;
    targets: EdgeConnection[];
}

export interface PendingTransition {
    edgeId: string;
    value: boolean;
}