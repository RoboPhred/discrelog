
import {
    SimulatorState,
    defaultSimulatorState
} from "./state";

import {
    Actions,
    ACTION_EVOLVE
} from "./actions";

import { PendingTransition } from "./types";

import { NODES } from "./nodes";

export default function simulatorReducer(
    state: SimulatorState = defaultSimulatorState,
    action: Actions
): SimulatorState {
    switch(action.type) {
        case ACTION_EVOLVE: {
            const {
                ticks
            } = action.payload;

            const finalTick = state.tick + ticks;

            if (state.transitions.length === 0) {
                return {
                    ...state,
                    tick: finalTick
                }
            }

            const { windows, remainder: transitions } = windowTransitions(state.transitions, finalTick);

            const nodeOutputs = {...state.nodeOutputs};

            for (const window of windows) {
                const invalidatedNodes = new Set<string>();

                // Apply transitions to outputs
                for (const transition of window) {
                    const { nodeId, output, value } = transition;
                    if (value === nodeOutputs[nodeId][output]) {
                        continue;
                    }

                    nodeOutputs[nodeId][output] = value;
                    for (const connection of state.nodeOutputConnections[nodeId][output]) {
                        invalidatedNodes.add(connection.targetNode);
                    }
                }

                // 2: evolve nodes whose inputs have changed.
                for (const evolveNodeId of invalidatedNodes) {
                    const nodeType = state.nodeTypes[evolveNodeId];
                    const evolver = NODES[nodeType].evolve;
                    const evolveResult = evolver()
                }
            }

            return {
                ...state,
                tick: finalTick,
                nodeOutputs,
                transitions
            }
        }
    }
    return state;
}

function windowTransitions(
    transitions: PendingTransition[],
    finalTick: number
): {
    windows: PendingTransition[][];
    remainder: PendingTransition[]
} {
    if (transitions.length === 0 || transitions[0].tick > finalTick) {
        return {
            windows: [],
            remainder: transitions
        };
    }

    let currentWindow: PendingTransition[] = [];
    let windowedTransactions: PendingTransition[][] = [currentWindow];
    let currentTick = transitions[0].tick;
    let transitionIndex = 0;
    
    for(const t of transitions) {
        if (t.tick > finalTick) {
            break;
        }

        if (t.tick > currentTick) {
            currentWindow = [];
            windowedTransactions.push(currentWindow);
            currentTick = t.tick
        }

        transitionIndex++;
        currentWindow.push(t);
    }

    return {
        windows: windowedTransactions,
        remainder: transitions.slice(transitionIndex)
    };
}
