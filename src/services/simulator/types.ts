
export interface NodePinMap {
    [key: string]: boolean;
}

export interface NodeConnection {
    /**
     * The ID of the node of this connection.
     */
    targetNode: string;

    /**
     * The name of the input on the target node.
     */
    targetInput: string;
}

export interface PinConnectionMap {
    [key: string]: NodeConnection[];
}

export interface PendingTransition {
    /**
     * The tick at which to execute this transition.
     */
    tick: number;

    /**
     * The node on which to transition the pin.
     */
    nodeId: string;

    /**
     * The output pin name.
     */
    output: string;

    /**
     * The value to transition to.
     */
    value: boolean;
}

export interface EvolveResult {
    transitions: {
        tick: number;
        output: string;
        value: boolean;
    }[];
}

export type NodeEvolverFunction = (inputs: NodePinMap, tick: number) => EvolveResult;

export interface NodeDefinition {
    INPUTS: string[];
    OUTPUTS: string[];
    evolve: NodeEvolverFunction;
}
