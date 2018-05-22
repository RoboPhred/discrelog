import binarySearch from "binary-search";
import uuidV4 from "uuid/v4";

import { IDMap } from "@/types";

import { SimulatorState } from "../state";

import { Node, TransitionWindow } from "../types";
import { NodeTypes, EvolutionResult } from "../node-types";

export function collectNodeTransitionsMutator(
  state: SimulatorState,
  nodeId: string
) {
  console.log("collecting transitions for", nodeId);

  const {
    tick,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    transitionWindows
  } = state;

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
  for (const inputPin of Object.keys(node.inputConnectionsByPin)) {
    const inputConn = node.inputConnectionsByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      continue;
    }
    const { nodeId: sourceNodeId, pin: sourcePin } = inputConn;

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
    for (const transition of result.transitions) {
      const { outputId, value } = transition;

      // Sanity check that we are not producing transitions for the past or current tick.
      const tickOffset = transition.tickOffset > 0 ? transition.tickOffset : 1;
      const transitionTick = tick + tickOffset;

      removeTransitionMutator(state, node.id, outputId);

      if (nodeOutputs[outputId] !== value) {
        addTransitionMutator(state, node.id, outputId, transitionTick, value);
      }

      console.log(`> tick ${transitionTick} pin ${outputId} = ${value}`);
    }
  }
}

function addTransitionMutator(
  state: SimulatorState,
  nodeId: string,
  outputId: string,
  tick: number,
  value: boolean
) {
  const {
    nodeOutputTransitionsByNodeId,
    transitionsById,
    transitionWindows
  } = state;

  const transitionId = uuidV4();

  transitionsById[transitionId] = {
    id: transitionId,
    nodeId,
    outputId,
    tick,
    value
  };

  let nodeTransitions = nodeOutputTransitionsByNodeId[nodeId];
  if (!nodeTransitions) {
    nodeTransitions = {};
    nodeOutputTransitionsByNodeId[nodeId] = nodeTransitions;
  }

  nodeTransitions[outputId] = transitionId;

  const transitionWindow = getWindow(transitionWindows, tick);
  transitionWindow.transitionIds.push(transitionId);
}

function removeTransitionMutator(
  state: SimulatorState,
  nodeId: string,
  outputId: string
) {
  const {
    nodeOutputTransitionsByNodeId,
    transitionsById,
    transitionWindows
  } = state;

  const pinTransitions = nodeOutputTransitionsByNodeId[nodeId];
  if (!pinTransitions) {
    return;
  }

  const transitionId = pinTransitions[outputId];
  if (!transitionId) {
    return;
  }

  // Remove the transition from the node output transitions
  delete pinTransitions[outputId];

  const transition = transitionsById[transitionId];
  if (!transition) {
    return;
  }

  // Remove the transition from the transitions map.
  delete transitionsById[transitionId];

  const transitionWindowIndex = transitionWindows.findIndex(
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

function getWindow(
  windows: TransitionWindow[],
  tick: number
): TransitionWindow {
  const index = binarySearch(windows, tick, (a, b) => a.tick - b);
  if (index >= 0) {
    return windows[index];
  }

  const insertAt = -index - 1;
  const result: TransitionWindow = {
    tick,
    transitionIds: []
  };
  windows.splice(insertAt, 0, result);
  return result;
}
