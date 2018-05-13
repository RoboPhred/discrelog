
import {
    NodePinMap,
    PinConnectionMap,
    PendingTransition
} from "./types";

import {
    NodeType
} from "./nodes";

export interface NodeMap<T> {
    [key: string]: T;
}

export interface SimulatorState {
    tick: number;

    nodeTypes: NodeMap<NodeType>;
    
    /**
     * A map of node IDs to a map of output names to value.
     */
    nodeOutputs: NodeMap<NodePinMap>;

    /**
     * A map of node IDs to a map of output names to their input targets.
     */
    nodeOutputConnections: NodeMap<PinConnectionMap>;

    /**
     * An array of pending transitions, sorted by .tick ascending
     */
    transitions: PendingTransition[];
}

export const defaultSimulatorState: SimulatorState = {
    tick: 0,
    nodeTypes: {},
    nodeOutputs: {},
    nodeOutputConnections: {},
    transitions: []
};
