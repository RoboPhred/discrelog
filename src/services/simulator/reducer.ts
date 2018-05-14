
import binarySearch from "binary-search";

import {
    Node
} from "./types";

import {
    SimulatorState,
    defaultSimulatorState,
    TransitionWindow
} from "./state";

import {
    Actions,
    ACTION_EVOLVE,
    ACTION_INTERACT
} from "./actions";

import { PendingTransition, InputValueMap, EvolutionResult } from "./types";

import { Nodes } from "./nodes";

export default function simulatorReducer(
    state: SimulatorState = defaultSimulatorState,
    action: Actions
): SimulatorState {
    switch(action.type) {
        case ACTION_INTERACT: {
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
                return state;
            }

            // TODO: do not clone unless needed.
            const newNodeStates = {...nodeStates};
            const newTransitionWindows = transitionWindows.map(x => ({
                tick: x.tick,
                transitions: [...x.transitions]
            }));

            const evolution = type.interact(nodeStates[nodeId]);
            applyNodeEvolution(node, tick, evolution, newNodeStates, newTransitionWindows);

            return {
                ...state,
                nodeStates: newNodeStates,
                transitionWindows: newTransitionWindows
            };
        }
        case ACTION_EVOLVE: {
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

            // TODO: do not clone unless needed.
            const newNodeStates = {...nodeStates};
            const newEdgeValues = {...edgeValues};
            const newTransitionWindows = transitionWindows.map(x => ({
                tick: x.tick,
                transitions: [...x.transitions]
            }));

            // For each window within our update range...
            const windows = popWhile(newTransitionWindows, x => x.tick <= endTick);
            for (const window of windows) {
                const tick = window.tick;
                const evolveNodes = new Set<string>();
                
                // apply the transitions for this tick window.
                for (const transition of window.transitions) {
                    const { edgeId, value } = transition;
                    if (newEdgeValues[edgeId] !== value) {
                        // Track what nodes we need to evolve as a result of this state change.
                        newEdgeValues[edgeId] = value;
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
                        inputs[input] = newEdgeValues[node.inputEdgeIds[input]];
                    }

                    const result = type.evolve(newNodeStates[nodeId] || {}, inputs, tick);
                    applyNodeEvolution(node, tick, result, newNodeStates, newTransitionWindows);
                }
            }

            return {
                ...state,
                tick: endTick,

                // TODO: do not rewrite if no changes.
                nodeStates: newNodeStates,
                edgeValues: newEdgeValues,
                transitionWindows: newTransitionWindows
            };
        }
    }

    return state;
}

function applyNodeEvolution(
    node: Node,
    tick: number,
    evolution: EvolutionResult,
    nodeStates: {[key: string]: any},
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
    while(items.length > 0) {
        const item = items.pop()!;
        if (!pickWhile(item)) {
            items.unshift(item);
            break;
        }
        result.push(item);
    }

    return result;
}
