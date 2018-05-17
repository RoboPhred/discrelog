
import produce from "immer";

import binarySearch from "binary-search";

import uuidV4 from "uuid/v4";

import {
    Node, Edge
} from "./types";

import {
    SimulatorState,
    defaultSimulatorState,
    TransitionWindow
} from "./state";

import {
    Actions,
    ACTION_WIRE,
    ACTION_UNWIRE,
    ACTION_EVOLVE,
    ACTION_INTERACT,
    WireNodeAction,
    UnwireNodeAction,
    InteractNodeAction,
    EvolveSimAction
} from "./actions";

import { PendingTransition, InputValueMap, EvolutionResult } from "./types";

import { Nodes } from "./nodes";

const wireAction = produce((state: SimulatorState, action: WireNodeAction) => {
    const {
        sourceNodeId,
        sourceOutput,
        targetNodeId,
        targetInput
    } = action.payload;

    const {
        tick,
        edges,
        nodeStates,
        edgeValues,
        transitionWindows
    } = state;

    const sourceNode = state.nodes[sourceNodeId];
    const targetNode = state.nodes[targetNodeId];

    if (!sourceNode || !targetNode) {
        return;
    }

    // Only one source per input
    if (targetNode.inputEdgeIds[targetInput] != null) {
        return;
    }

    let edgeId = sourceNode.outputEdgeIds[sourceOutput];
    let edge: Edge;
    if (edgeId) {
        // Edge exists
        edge = edges[edgeId];
        if (edge.targets.some(c => c.nodeId === targetNodeId && c.port === targetInput)) {
            // Already wired in.
            return;
        }
    }
    else {
        // No edge hooked up to output.  Create one and
        //  apply it to the source node.
        edgeId = uuidV4();
        edge = {
            id: edgeId,
            source: { nodeId: sourceNodeId, port: sourceOutput },
            targets: []
        };
        edges[edgeId] = edge;
        edgeValues[edgeId] = false;
        sourceNode.outputEdgeIds[sourceOutput] = edgeId;
    }

    // Add the new target
    edge.targets.push({
        nodeId: targetNodeId,
        port: targetInput
    });

    // Tell the target about its new edge
    targetNode.inputEdgeIds[targetInput] = edgeId;

    // Evolve with the new inputs.
    const type = Nodes[targetNode.type];
    if (type && type.evolve) {
        const inputs: InputValueMap = {};
        for (const input of Object.keys(targetNode.inputEdgeIds)) {
            const edgeId = targetNode.inputEdgeIds[input];
            inputs[input] = edgeId ? edgeValues[edgeId] : false;
        }

        // TODO: Provide frozen state.  The state passed to this is currently
        //  the immer mutable record.
        const result = type.evolve(nodeStates[targetNodeId] || {}, inputs, tick);
        applyNodeEvolution(targetNode, tick, result, nodeStates, transitionWindows);
    }
});

const unwireAction = produce((state: SimulatorState, action: UnwireNodeAction) => {
    const {
        sourceNodeId,
        sourceOutput,
        targetNodeId,
        targetInput
    } = action.payload;

    const {
        tick,
        edges,
        nodeStates,
        edgeValues,
        transitionWindows
    } = state;

    const sourceNode = state.nodes[sourceNodeId];
    const targetNode = state.nodes[targetNodeId];

    if (!sourceNode || !targetNode) {
        return;
    }

    const edgeId = sourceNode.outputEdgeIds[sourceOutput];
    if (!edgeId) {
        return;
    }

    const edge = edges[edgeId];
    if (!edge) {
        return;
    }

    const connIndex = edge.targets.findIndex(c => c.nodeId === targetNodeId && c.port === targetInput);
    if (connIndex === -1) {
        return;
    }

    // Disconnect the edge from the target.
    targetNode.inputEdgeIds[targetInput] = null;

    if (edge.targets.length === 1) {
        // If this was the last connection, remove the edge.
        delete edges[edgeId];
        delete edgeValues[edgeId];

        // Since we are removing the edge, we have to remove
        //  the reference on the source node as well.
        sourceNode.outputEdgeIds[sourceOutput] = null;
    }
    else {
        // Otherwise, remove the target.
        edge.targets.splice(connIndex, 1);
    }

    // Evolve with the new inputs.
    const type = Nodes[targetNode.type];
    if (type && type.evolve) {
        const inputs: InputValueMap = {};
        for (const input of Object.keys(targetNode.inputEdgeIds)) {
            const edgeId = targetNode.inputEdgeIds[input];
            inputs[input] = edgeId ? edgeValues[edgeId] : false;
        }

        // TODO: Provide frozen state.  The state passed to this is currently
        //  the immer mutable record.
        const result = type.evolve(nodeStates[targetNodeId] || {}, inputs, tick);
        applyNodeEvolution(targetNode, tick, result, nodeStates, transitionWindows);
    }
});

const interactAction = produce((state: SimulatorState, action: InteractNodeAction) => {
    const {
        nodeId
    } = action.payload;
    const {
        tick,
        nodes,
        nodeStates,
        transitionWindows
    } = state;

    const node = nodes[nodeId];
    const type = Nodes[node.type];
    if (!type || !type.interact) {
        return;
    }
    const evolution = type.interact(nodeStates[nodeId]);
    applyNodeEvolution(node, tick, evolution, nodeStates, transitionWindows);
    return;
});

const evolveAction = produce((state: SimulatorState, action: EvolveSimAction) => {
    const {
        tickCount
    } = action.payload;
    const {
        tick,
        nodes,
        nodeStates,
        edges,
        edgeValues,
        transitionWindows,
    } = state;

    const endTick = tick + tickCount;

    // For each window within our update range...
    const windows = popWhile(transitionWindows, x => x.tick <= endTick);
    for (const window of windows) {
        const tick = window.tick;
        const evolveNodes = new Set<string>();

        // apply the transitions for this tick window.
        for (const transition of window.transitions) {
            const { edgeId, value } = transition;
            if (edgeValues[edgeId] !== value) {
                // Track what nodes we need to evolve as a result of this state change.
                edgeValues[edgeId] = value;
                const targetNodes = edges[edgeId].targets;
                targetNodes.forEach(conn => evolveNodes.add(conn.nodeId));
            }
        }

        // Evolve affected nodes.
        for (const nodeId of evolveNodes) {
            const node = nodes[nodeId];
            const type = Nodes[node.type];
            if (!type || !type.evolve) {
                continue;
            }

            const inputs: InputValueMap = {};
            for (const input of Object.keys(node.inputEdgeIds)) {
                const edgeId = node.inputEdgeIds[input];
                inputs[input] = edgeId ? edgeValues[edgeId] : false;
            }

            const result = type.evolve(nodeStates[nodeId] || {}, inputs, tick);
            applyNodeEvolution(node, tick, result, nodeStates, transitionWindows);
        }
    }

    state.tick = endTick;
});

export default function simulatorReducer(
    state: SimulatorState = defaultSimulatorState,
    action: Actions
): SimulatorState {
    switch (action.type) {
        case ACTION_WIRE:
            return wireAction(state, action);
        case ACTION_UNWIRE:
            return unwireAction(state, action);
        case ACTION_INTERACT:
            return interactAction(state, action);
        case ACTION_EVOLVE:
            return evolveAction(state, action);
    }
    return state;
};

function applyNodeEvolution(
    node: Node,
    tick: number,
    evolution: EvolutionResult,
    nodeStates: { [key: string]: any },
    transitionWindows: TransitionWindow[]
) {
    if (evolution.state) {
        nodeStates[node.id] = evolution.state;
    }

    if (evolution.transitions) {
        for (const transition of evolution.transitions) {
            // Register the transition.
            const transitionTick = tick + transition.tickOffset;
            const edgeId = node.outputEdgeIds[transition.outputId];

            if (edgeId == null) {
                // Edge is not wired up.
                continue;
            }

            // Warning: getWindow mutates newTransitionWindows.
            //  We currently work off a clone of the object, but we should make this
            //  only clone where needed. 
            const transitionWindow = getWindow(transitionWindows, transitionTick);
            transitionWindow.transitions.push({
                edgeId,
                value: transition.value
            });
        }
    }
}

function getWindow(windows: TransitionWindow[], tick: number): TransitionWindow {
    const index = binarySearch(windows, tick, (a, b) => b - a.tick);
    if (index >= 0) {
        return windows[index];
    }

    const insertAt = -index - 1;
    const result: TransitionWindow = {
        tick,
        transitions: []
    };
    windows.splice(insertAt, 0, result);
    return result;
}

function popWhile<T>(items: T[], pickWhile: (item: T) => boolean): T[] {
    const result = [];
    while (items.length > 0) {
        const item = items.pop()!;
        if (!pickWhile(item)) {
            items.unshift(item);
            break;
        }
        result.push(item);
    }

    return result;
}
