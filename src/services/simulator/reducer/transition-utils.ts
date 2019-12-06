import binarySearch from "binary-search";
import uuidV4 from "uuid/v4";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

import { SimulatorState } from "@/services/simulator/state";
import { TransitionWindow, NodePin } from "@/services/simulator/types";

export function addTransition(
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

export function removeTransitionByPin(state: SimulatorState, pin: NodePin) {
  const { nodeId, pin: outputId } = pin;

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
