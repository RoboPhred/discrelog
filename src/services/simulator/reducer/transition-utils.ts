import binarySearch from "binary-search";
import uuidV4 from "uuid/v4";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

import { IDMap } from "@/types";

import { SimulatorState } from "../state";
import { TransitionWindow, NodePin } from "../types";
import { NodeTypes } from "../node-types";

import { nodeInputConnectionsByPinSelector } from "../selectors/connections";

export function collectNodeTransitionsMutator(
  state: SimulatorState,
  nodeId: string
) {
  const { tick, nodeStatesByNodeId, nodeOutputValuesByNodeId } = state;

  const node = state.nodesById[nodeId];
  if (!node) {
    return;
  }

  // Evolve with the new inputs.
  const type = NodeTypes[node.type];
  if (!type || !type.evolve) {
    return;
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

    inputs[inputPin] = nodeOutputValuesByNodeId[sourceNodeId][sourcePin];
  }

  // TODO: Provide frozen state.  The state passed to this is currently
  //  the immer mutable record.
  const result = type.evolve(nodeStatesByNodeId[node.id], inputs, tick);

  if (result.state) {
    nodeStatesByNodeId[node.id] = result.state;
  }

  if (result.transitions) {
    const nodeOutputs = nodeOutputValuesByNodeId[node.id] || {};
    for (const outputId of Object.keys(result.transitions)) {
      const { tickOffset, value } = result.transitions[outputId];

      // Sanity check that we are not producing transitions for the past or current tick.
      const transitionTick = tick + (tickOffset > 0 ? tickOffset : 1);

      removeTransitionByPin(state, { nodeId: node.id, pinId: outputId });

      if (nodeOutputs[outputId] !== value) {
        addTransition(state, node.id, outputId, transitionTick, value);
      }
    }
  }
}

function addTransition(
  state: SimulatorState,
  nodeId: string,
  outputId: string,
  tick: number,
  value: boolean
) {
  const { transitionsById } = state;

  const transitionId = uuidV4();

  transitionsById[transitionId] = {
    id: transitionId,
    nodeId,
    outputId,
    tick,
    value
  };

  const transitionWindow = getOrCreateWindow(state, tick);
  transitionWindow.transitionIds.push(transitionId);
}

function removeTransitionByPin(state: SimulatorState, pin: NodePin) {
  const { nodeId, pinId: outputId } = pin;

  const { transitionsById, transitionWindows } = state;

  const transition = find(
    transitionsById,
    t => t.nodeId === nodeId && t.outputId === outputId
  );
  if (!transition) {
    return;
  }

  const { id: transitionId } = transition;

  // Remove the transition from the transitions map.
  delete transitionsById[transitionId];

  const transitionWindowIndex = findIndex(
    transitionWindows,
    x => x.tick === transition.tick
  );
  if (transitionWindowIndex === -1) {
    return;
  }
  const transitionWindow = transitionWindows[transitionWindowIndex];

  const tickWindowTransitionIndex = transitionWindow.transitionIds.indexOf(
    transitionId
  );
  if (tickWindowTransitionIndex === -1) {
    return;
  }
  if (transitionWindow.transitionIds.length === 1) {
    // Only one element left, remove the window.
    transitionWindows.splice(transitionWindowIndex, 1);
  } else {
    // Remove the transition from the tick window.
    transitionWindow.transitionIds.splice(tickWindowTransitionIndex, 1);
  }
}

function getOrCreateWindow(
  state: SimulatorState,
  tick: number
): TransitionWindow {
  const { transitionWindows } = state;
  const index = binarySearch(transitionWindows, tick, (a, b) => a.tick - b);
  if (index >= 0) {
    return transitionWindows[index];
  }

  // When binarySeach cannot find a value, it returns the next highest index negated.
  //  We can insert the value at the proper point by flipping the negation and subtracting 1.
  const insertAt = -index - 1;
  const result: TransitionWindow = {
    tick,
    transitionIds: []
  };
  transitionWindows.splice(insertAt, 0, result);
  return result;
}
