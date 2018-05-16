
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
    ACTION_INTERACT
} from "./actions";

import { PendingTransition, InputValueMap, EvolutionResult } from "./types";

import { Nodes } from "./nodes";

export default function simulatorReducer(
    state: SimulatorState = defaultSimulatorState,
    action: Actions
): SimulatorState {
    switch(action.type) {
        case ACTION_WIRE: {
            const {
                sourceNodeId,
                sourceOutput,
                targetNodeId,
                targetInput
            } = action.payload;

            const {
                edges
            } = state;

            let sourceNode = state.nodes[sourceNodeId];
            let targetNode = state.nodes[targetNodeId];

            if (!sourceNode || !targetNode) {
                return state;
            }

            // Only one source per input
            if (targetNode.inputEdgeIds[targetInput] != null) {
                return state;
            }

            let edgeId = sourceNode.outputEdgeIds[sourceOutput];
            let edge: Edge;
            if (edgeId) {
                // Edge exists, clone it
                edge = {...edges[edgeId]};
            }
            else {
                // No edge hooked up to output.  Create one and
                //  apply it to the source node.
                edgeId = uuidV4();
                edge = {
                    id: edgeId,
                    source: {nodeId: sourceNodeId, port: sourceOutput},
                    targets: []
                };
                sourceNode = {
                    ...sourceNode,
                    outputEdgeIds: {
                        ...sourceNode.outputEdgeIds,
                        [sourceOutput]: edgeId
                    }
                };
            }

            if (edge.targets.some(c => c.nodeId === targetNodeId && c.port === targetInput)) {
                // Already wired in.
                return state;
            }

            // Add the new target
            edge.targets = [
                ...edge.targets,
                { nodeId: targetNodeId, port: targetInput }
            ];

            // Tell the target about its new edge
            targetNode = {
                ...targetNode,
                inputEdgeIds: {
                    ...targetNode.inputEdgeIds,
                    [targetInput]: edgeId
                }
            };

            return {
                ...state,
                edges: {
                    ...edges,
                    [edgeId]: edge
                },
                nodes: {
                    ...state.nodes,
                    [sourceNodeId]: sourceNode,
                    [targetNodeId]: targetNode
                }
            };
        }
        case ACTION_UNWIRE: {
            const {
                sourceNodeId,
                sourceOutput,
                targetNodeId,
                targetInput
            } = action.payload;

            const {
                edges
            } = state;

            let sourceNode = state.nodes[sourceNodeId];
            let targetNode = state.nodes[targetNodeId];

            if (!sourceNode || !targetNode) {
                return state;
            }

            let edgeId = sourceNode.outputEdgeIds[sourceOutput];
            if (!edgeId) {
                return state;
            }

            const edge = edges[edgeId];
            if (!edge) {
                return state;
            }

            const connIndex = edge.targets.findIndex(c => c.nodeId === targetNodeId && c.port === targetInput);
            if (connIndex === -1) {
                return state;
            }

            targetNode = {
                ...targetNode,
                inputEdgeIds: {
                    ...targetNode.inputEdgeIds,
                    [targetInput]: null
                }
            };

            // TODO: Delete edge if targets is zero.

            return {
                ...state,
                nodes: {
                    ...state.nodes,
                    [targetNodeId]: targetNode
                },
                edges: {
                    ...state.edges,
                    [edgeId]: {
                        ...edge,
                        targets: [
                            ...edge.targets.slice(0, connIndex),
                            ...edge.targets.slice(connIndex + 1)
                        ]
                    }
                }
            };
        }
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
                        const edgeId = node.inputEdgeIds[input];
                        inputs[input] = edgeId ? newEdgeValues[edgeId] : false;
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
