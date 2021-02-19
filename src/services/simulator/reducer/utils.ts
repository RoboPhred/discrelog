import binarySearch from "binary-search";
import { v4 as uuidV4 } from "uuid";
import findIndex from "lodash/findIndex";
import pick from "lodash/pick";
import difference from "lodash/difference";

import { fpSet } from "@/utils";
import { asArray } from "@/arrays";
import { AppState } from "@/store";

import {
  inputPinsByPinIdFromSimulatorNodeIdSelector,
  outputSimulatorNodeIdsFromSimulatorNodeIdSelector,
} from "@/services/simulator-graph/selectors/connections";
import {
  simulatorNodeIdsSelector,
  elementTypeFromSimulatorNodeId,
} from "@/services/simulator-graph/selectors/nodes";

import { SimulatorServiceState, defaultSimulatorServiceState } from "../state";
import {
  SimTransitionWindow,
  SimNodePinTransition as SimNodeTransition,
} from "../types";
import { ElementDefinitionsByType } from "@/elements";

export function simInit(
  state: SimulatorServiceState,
  appState: AppState
): SimulatorServiceState {
  const nodeIds = simulatorNodeIdsSelector(appState);

  state = defaultSimulatorServiceState;

  state = nodeIds.reduce(
    (state, nodeId) => initNode(state, nodeId, appState),
    state
  );

  state = nodeIds.reduce(
    (state, nodeId) => collectNodeTransitions(state, nodeId, appState),
    state
  );

  return state;
}

function initNode(
  state: SimulatorServiceState,
  nodeId: string,
  appState: AppState
): SimulatorServiceState {
  const elementType = elementTypeFromSimulatorNodeId(appState, nodeId);
  if (!elementType) {
    return state;
  }

  const def = ElementDefinitionsByType[elementType];
  if (!def) {
    return state;
  }

  const outputValues: Record<string, boolean> = {};
  for (const output of def.outputPins) {
    outputValues[output] = false;
  }

  return fpSet(state, "nodeOutputValuesByNodeId", nodeId, outputValues);
}

export function simTick(
  state: SimulatorServiceState,
  tickCount: number,
  appState: AppState
): SimulatorServiceState {
  const endTick = state.tick + tickCount;

  // We cannot grab the windows ahead of time, as some windows might generate more windows
  //  for future ticks.

  // Pre-clone windows as we wil be repeatedly modifying it.
  state = {
    ...state,
    transitionWindows: [...state.transitionWindows],
  };

  let saftyCount = tickCount + 1;
  while (
    state.transitionWindows.length > 0 &&
    state.transitionWindows[0].tick <= endTick
  ) {
    if (--saftyCount === 0) {
      // If we have seen more windows than ticks, something is creating windows for past ticks.
      throw new Error(
        `Maximum ticks per sim evolution exceeded.  This is an indication that windows are being generated for past ticks.`
      );
    }

    // We can safely mutate here, as even if the array is regenerated
    //  from a tick it will still be a fresh copy that has not yet been
    //  consumed by redux.
    const window = state.transitionWindows.shift()!;
    state = tickWindow(state, window, appState);
  }

  // If we did not encounter a window on our last tick, jump ahead to that tick.
  if (state.tick != endTick) {
    state = {
      ...state,
      tick: endTick,
    };
  }

  return state;
}

function tickWindow(
  state: SimulatorServiceState,
  window: SimTransitionWindow,
  appState: AppState
): SimulatorServiceState {
  // Update the current tick, as it is referenced
  //  during transition collection.
  state = {
    ...state,
    tick: window.tick,
    // pre-clone outputs for mutation below
    nodeOutputValuesByNodeId: {
      ...state.nodeOutputValuesByNodeId,
    },
  };

  // Could benefit from being changed to a Set, although nodes usually arent hooked up to too many
  //  outputs at a time.
  let updatedNodes = [];
  for (const tid of window.transitionIds) {
    const { nodeId, valuesByOutputPin } = state.transitionsById[tid];

    // nodeOutputValuesByNodeId is pre-cloned
    state.nodeOutputValuesByNodeId[nodeId] = {
      ...state.nodeOutputValuesByNodeId[nodeId],
      ...valuesByOutputPin,
    };

    // Add each node we output to, to the output list.
    const outputNodeIds = outputSimulatorNodeIdsFromSimulatorNodeIdSelector(
      appState,
      nodeId
    );
    for (const nodeId of outputNodeIds) {
      if (updatedNodes.indexOf(nodeId) === -1) {
        updatedNodes.push(nodeId);
      }
    }
  }

  // Remove all window transitions as they have been consumed.
  // State is cloned above
  state.transitionsById = pick(
    state.transitionsById,
    difference(Object.keys(state.transitionsById), window.transitionIds)
  );

  for (const nodeId of updatedNodes) {
    state = collectNodeTransitions(state, nodeId, appState);
  }

  return state;
}

export function collectNodeTransitions(
  state: SimulatorServiceState,
  nodeId: string,
  appState: AppState
): SimulatorServiceState {
  const elementType = elementTypeFromSimulatorNodeId(appState, nodeId);
  if (!elementType) {
    return state;
  }

  const def = ElementDefinitionsByType[elementType];
  if (!def || !def.evolve) {
    return state;
  }

  // Build the current input state from the connected pins.
  const inputs: Record<string, boolean> = {};
  const inputSourcesByPin = inputPinsByPinIdFromSimulatorNodeIdSelector(
    appState,
    nodeId
  );

  for (const inputPin of Object.keys(inputSourcesByPin)) {
    const inputConn = inputSourcesByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      continue;
    }
    const { simulatorNodeId: sourceNodeId, pinId: sourcePinId } = inputConn;

    inputs[inputPin] =
      state.nodeOutputValuesByNodeId[sourceNodeId]?.[sourcePinId] || false;
  }

  const result = def.evolve(
    state.nodeStatesByNodeId[nodeId],
    inputs,
    state.tick
  );

  if (result.state) {
    state = fpSet(state, "nodeStatesByNodeId", nodeId, result.state);
  }

  if (result.transitions) {
    const transitions = asArray(result.transitions);
    for (const transition of transitions) {
      const {
        tickOffset,
        valuesByPin,
        transitionMerger = "replace",
      } = transition;

      // Sanity check that we are not producing transitions for the past or current tick.
      const transitionTick = state.tick + (tickOffset > 0 ? tickOffset : 1);

      // We originally removed old transitions when scheduling new transitions.
      //  Experimenting without this.
      if (transitionMerger === "replace") {
        state = removeTransitionsByNodeId(state, nodeId);
      }

      state = addTransition(state, nodeId, transitionTick, valuesByPin);
    }
  }

  return state;
}

function addTransition(
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  tick: number,
  valuesByOutputPin: Record<string, boolean>
): SimulatorServiceState {
  const transitionId = uuidV4();

  const newTransition: SimNodeTransition = {
    nodeId,
    tick,
    valuesByOutputPin,
  };

  // Prepare the new transition window.
  const newTransitionWindows = [...state.transitionWindows];

  let index = binarySearch(newTransitionWindows, tick, (a, b) => a.tick - b);
  if (index < 0) {
    // Need to create a new window
    index = -index - 1;
    const newWindow: SimTransitionWindow = {
      tick,
      transitionIds: [],
    };
    newTransitionWindows.splice(index, 0, newWindow);
  }

  newTransitionWindows[index] = {
    ...newTransitionWindows[index],
    transitionIds: [...newTransitionWindows[index].transitionIds, transitionId],
  };

  return {
    ...state,
    // Add the new transition window to the id mapping.
    transitionsById: {
      ...state.transitionsById,
      [transitionId]: newTransition,
    },
    transitionWindows: newTransitionWindows,
  };
}

function removeTransitionsByNodeId(
  state: Readonly<SimulatorServiceState>,
  nodeId: string
): SimulatorServiceState {
  function isNodeTransition(transition: SimNodeTransition) {
    return transition.nodeId === nodeId;
  }

  const transitionIds = Object.keys(state.transitionsById).filter((id) =>
    isNodeTransition(state.transitionsById[id])
  );

  return transitionIds.reduce(
    (state, transitionId) => removeTransitionById(state, transitionId),
    state
  );
}

export function removeTransitionById(
  state: Readonly<SimulatorServiceState>,
  transitionId: string
): SimulatorServiceState {
  const transition = state.transitionsById[transitionId];
  if (!transition) {
    return state;
  }

  const transitionsById = pick(
    state.transitionsById,
    Object.keys(state.transitionsById).filter((x) => x !== transitionId)
  );
  let transitionWindows = state.transitionWindows;

  const transitionWindowIndex = findIndex(
    transitionWindows,
    (x) => x.tick === transition.tick
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
          ...transitionWindows.slice(transitionWindowIndex + 1),
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
            ...transitionIds.slice(tickWindowTransitionIndex + 1),
          ],
        };
      }
    }
  }

  return {
    ...state,
    transitionsById,
    transitionWindows,
  };
}
