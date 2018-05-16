
import {
    Node,
    Edge,
    PendingTransition
} from "./types";

import {
    NodeType
} from "./nodes";

export interface NodeMap<T> {
    [key: string]: T;
}

export interface TransitionWindow {
    tick: number;
    transitions: PendingTransition[];
}

export interface SimulatorState {
    tick: number;

    nodes: {
        [key: string]: Node
    };

    nodeStates: {
        [key: string]: any;
    };

    edges: {
        [key: string]: Edge
    };

    edgeValues: {
        [key: string]: boolean;
    }

    /**
     * Transitions windowed by tick, sorted ascending
     * on tick.
     */
    transitionWindows: TransitionWindow[];
}

// export const defaultSimulatorState: SimulatorState = {
//     tick: 0,
//     nodes: {},
//     nodeStates: {},
//     edges: {},
//     edgeValues: {},
//     transitionWindows: []
// };

export const defaultSimulatorState: SimulatorState = {
    tick: 0,
    nodes: {
        "toggle-a": {
            id: "toggle-a",
            type: "toggle",
            inputEdgeIds: {},
            outputEdgeIds: {
                "OUT": "input-a"
            }
        },
        "toggle-b": {
            id: "toggle-b",
            type: "toggle",
            inputEdgeIds: {},
            outputEdgeIds: {
                "OUT": "input-b"
            }
        },
        "and": {
            id: "and",
            type: "and",
            inputEdgeIds: {
                "A": "input-a",
                "B": "input-b"
            },
            outputEdgeIds: {
                "OUT": "output"
            }
        },
        "out-led": {
            id: "out-led",
            type: "led",
            inputEdgeIds: {
                "IN": "output"
            },
            outputEdgeIds: {}
        }
    },
    nodeStates: {
        "toggle-a": {
            toggleState: false
        },
        "toggle-b": {
            toggleState: false
        }
    },
    edges: {
        "input-a": {
            id: "input-a",
            source: {nodeId: "toggle-a", port: "OUT"},
            targets: [{nodeId: "and", port: "A"}]
        },
        "input-b": {
            id: "input-b",
            source: {nodeId: "toggle-b", port: "OUT"},
            targets: [{nodeId: "and", port: "B"}]
        },
        "output": {
            id: "output",
            source: {nodeId: "and", port: "OUT"}, 
            targets: [{nodeId: "out-led", port: "IN"}]
        }
    },
    edgeValues: {
        "input-a": false,
        "input-b": false,
        "output": false
    },
    transitionWindows: []
};
