import binarySearch from "binary-search";
import uuidV4 from "uuid/v4";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import pick from "lodash/pick";

import { fpSet } from "@/utils";
import { IDMap, NodePin } from "@/types";
import { NodeTypes } from "@/node-defs";

import { SimulatorState } from "../state";
import { SimTransitionWindow, SimNodePinTransition } from "../types";

import { nodeInputConnectionsByPinSelector } from "../selectors/connections";

export function collectNodeTransitions(
  state: SimulatorState,
  nodeId: string
): SimulatorState {
  const node = state.nodesById[nodeId];
  if (!node) {
    return state;
  }

  const type = NodeTypes[node.type];
  if (!type || !type.evolve) {
    return state;
  }

  // Build the current input state from the connected pins.
  const inputs: IDMap<boolean> = {};
  const inputConnectionsByPin = nodeInputConnectionsByPinSelector.local(
    state,
    nodeId
  );
  for (const inputPin of Object.keys(inputConnectionsByPin)) {
    const inputConn = inputConnectionsByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      continue;
    }
    const { nodeId: sourceNodeId, pinId: sourcePin } = inputConn;

    inputs[inputPin] = state.nodeOutputValuesByNodeId[sourceNodeId][sourcePin];
  }

  // TODO: Provide frozen state.  The state passed to this is currently
  //  the immer mutable record.
  const result = type.evolve(
    state.nodeStatesByNodeId[node.id],
    inputs,
    state.tick
  );

  if (result.state) {
    state = fpSet(state, "nodeStatesByNodeId", node.id, result.state);
  }

  if (result.transitions) {
    const nodeOutputs = state.nodeOutputValuesByNodeId[node.id] || {};
    for (const outputId of Object.keys(result.transitions)) {
      const { tickOffset, value } = result.transitions[outputId];

      // Sanity check that we are not producing transitions for the past or current tick.
      const transitionTick = state.tick + (tickOffset > 0 ? tickOffset : 1);

      state = removeTransitionByPin(state, {
        nodeId: node.id,
        pinId: outputId
      });

      if (nodeOutputs[outputId] !== value) {
        state = addTransition(state, node.id, outputId, transitionTick, value);
      }
    }
  }

  return state;
}

function addTransition(
  state: Readonly<SimulatorState>,
  nodeId: string,
  outputId: string,
  tick: number,
  value: boolean
): SimulatorState {
  const transitionId = uuidV4();

  const newTransition: SimNodePinTransition = {
    id: transitionId,
    nodeId,
    outputId,
    tick,
    value
  };

  // Add the transition to the state, and clone transitionWindows for mutation below.
  state = {
    ...state,
    transitionsById: {
      ...state.transitionsById,
      [transitionId]: newTransition
    },
    transitionWindows: [...state.transitionWindows]
  };

  let index = binarySearch(state.transitionWindows, tick, (a, b) => a.tick - b);
  if (index < 0) {
    // Need to create a new window
    index = -index - 1;
    const newWindow: SimTransitionWindow = {
      tick,
      transitionIds: []
    };
    // Mutation is safe here as we cloned the array above.
    state.transitionWindows.splice(index, 0, newWindow);
  }

  // Mutation is safe here as we cloned the array above.
  state.transitionWindows[index] = {
    ...state.transitionWindows[index],
    transitionIds: [
      ...state.transitionWindows[index].transitionIds,
      transitionId
    ]
  };
  return state;
}

function removeTransitionByPin(
  state: Readonly<SimulatorState>,
  pin: NodePin
): SimulatorState {
  const { nodeId, pinId: outputId } = pin;

  const transition = find(
    state.transitionsById,
    t => t.nodeId === nodeId && t.outputId === outputId
  );
  if (!transition) {
    return state;
  }

  const { id: transitionId } = transition;

  const transitionsById = pick(
    state.transitionsById,
    Object.keys(state.transitionsById).filter(x => x !== transitionId)
  );
  let transitionWindows = state.transitionWindows;

  const transitionWindowIndex = findIndex(
    transitionWindows,
    x => x.tick === transition.tick
  );
  if (transitionWindowIndex !== -1) {
    const transitionWindow = transitionWindows[transitionWindowIndex];

    const tickWindowTransitionIndex = transitionWindow.transitionIds.indexOf(
      transitionId
    );
    if (tickWindowTransitionIndex !== -1) {
      if (transitionWindow.transitionIds.length === 1) {
        // Only one element left, remove the window.
        transitionWindows = [
          ...transitionWindows.slice(0, transitionWindowIndex),
          ...transitionWindows.slice(transitionWindowIndex + 1)
        ];
      } else {
        // Remove the transition from the tick window.
        transitionWindows = [...transitionWindows];
        const transitionIds =
          transitionWindows[transitionWindowIndex].transitionIds;
        transitionWindows[transitionWindowIndex] = {
          ...transitionWindows[transitionWindowIndex],
          transitionIds: [
            ...transitionIds.slice(0, tickWindowTransitionIndex),
            ...transitionIds.slice(tickWindowTransitionIndex, 1)
          ]
        };
      }
    }
  }

  return {
    ...state,
    transitionsById,
    transitionWindows
  };
}
