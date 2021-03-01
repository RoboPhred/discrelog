import binarySearch from "binary-search";
import { v4 as uuidV4 } from "uuid";
import pick from "lodash/pick";
import difference from "lodash/difference";

import { fpSet } from "@/utils";
import { asArray, dropIndexFp } from "@/arrays";
import { AppState } from "@/store";
import { OutputTransition } from "@/logic";

import {
  inputPinsByPinIdFromSimulatorNodeIdSelector,
  outputSimulatorNodeIdsFromSimulatorNodeIdSelector,
} from "@/services/simulator-graph/selectors/connections";
import {
  simulatorNodeIdsSelector,
  elementDefFromSimulatorNodeId,
} from "@/services/simulator-graph/selectors/nodes";

import { SimulatorServiceState, defaultSimulatorServiceState } from "../state";
import { SimTransitionWindow, SimNodePinTransition } from "../types";

export function simInit(
  state: Readonly<SimulatorServiceState>,
  appState: Readonly<AppState>
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
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const def = elementDefFromSimulatorNodeId(appState, nodeId);
  if (!def) {
    return state;
  }

  const outputValues: Record<string, boolean> = {};
  def.outputPins.forEach((output) => {
    outputValues[output] = false;
  });

  return fpSet(state, "nodeOutputValuesByNodeId", nodeId, outputValues);
}

export function simTick(
  state: Readonly<SimulatorServiceState>,
  tickCount: number,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const endTick = state.tick + tickCount;

  // We cannot grab the windows ahead of time, as some windows might generate more windows
  //  for future ticks.

  // Pre-clone windows as we wil be repeatedly modifying it.
  state = Object.assign({}, state, {
    transitionWindows: state.transitionWindows.slice(),
  });

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
  readonlyState: Readonly<SimulatorServiceState>,
  window: SimTransitionWindow,
  appState: Readonly<AppState>
): SimulatorServiceState {
  if (window.transitionIds.length === 0) {
    return readonlyState;
  }

  // Update the current tick, as it is referenced
  //  during transition collection.
  let state = Object.assign({}, readonlyState, {
    tick: window.tick,
    // pre-clone outputs for mutation below
    nodeOutputValuesByNodeId: Object.assign(
      {},
      readonlyState.nodeOutputValuesByNodeId
    ),
  }) as SimulatorServiceState;

  // Could benefit from being changed to a Set, although nodes usually arent hooked up to too many
  //  outputs at a time.
  const updatedNodes = new Set<string>();
  window.transitionIds.forEach((tid) => {
    const { nodeId, valuesByOutputPin } = state.transitionsById[tid];

    if (
      !isOutputsUpdated(
        state.nodeOutputValuesByNodeId[nodeId],
        valuesByOutputPin
      )
    ) {
      // Values are unchanged from current, node will not update.
      return;
    }

    // nodeOutputValuesByNodeId is pre-cloned
    state.nodeOutputValuesByNodeId[nodeId] = Object.assign(
      {},
      state.nodeOutputValuesByNodeId[nodeId],
      valuesByOutputPin
    );

    // Add each node we output to, to the output list.
    const outputNodeIds = outputSimulatorNodeIdsFromSimulatorNodeIdSelector(
      appState,
      nodeId
    );
    outputNodeIds.forEach((nodeId) => updatedNodes.add(nodeId));
  });

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

function isOutputsUpdated(
  outputs: Record<string, boolean>,
  updates: Record<string, boolean>
) {
  return Object.keys(updates).some((key) => outputs[key] !== updates[key]);
}

export function collectNodeTransitions(
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const def = elementDefFromSimulatorNodeId(appState, nodeId);
  if (!def || !def.evolve) {
    return state;
  }

  // Build the current input state from the connected pins.
  const inputs = collectNodeInputs(state, nodeId, appState);
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
    state = transitions.reduce(
      (state, transition) => applyOutputTransition(state, nodeId, transition),
      state
    );
  }

  return state;
}

function collectNodeInputs(
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  appState: Readonly<AppState>
): Record<string, boolean> {
  // Build the current input state from the connected pins.
  const inputs: Record<string, boolean> = {};
  const inputSourcesByPin = inputPinsByPinIdFromSimulatorNodeIdSelector(
    appState,
    nodeId
  );

  Object.keys(inputSourcesByPin).forEach((inputPin) => {
    const inputConn = inputSourcesByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      return;
    }

    const { simulatorNodeId: sourceNodeId, pinId: sourcePinId } = inputConn;
    inputs[inputPin] =
      state.nodeOutputValuesByNodeId[sourceNodeId]?.[sourcePinId] || false;
  });

  return inputs;
}

function applyOutputTransition(
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  transition: OutputTransition
): SimulatorServiceState {
  const { tickOffset, valuesByPin, transitionMerger = "replace" } = transition;

  // Sanity check that we are not producing transitions for the past or current tick.
  const transitionTick = state.tick + (tickOffset > 0 ? tickOffset : 1);

  // We originally removed old transitions when scheduling new transitions.
  //  Experimenting without this.
  if (transitionMerger === "replace") {
    state = removeTransitionsByNodeId(state, nodeId);
  }

  return addTransition(state, nodeId, transitionTick, valuesByPin);
}

function addTransition(
  state: Readonly<SimulatorServiceState>,
  nodeId: string,
  tick: number,
  valuesByOutputPin: Record<string, boolean>
): SimulatorServiceState {
  const transitionId = uuidV4();

  const newTransition: SimNodePinTransition = {
    nodeId,
    tick,
    valuesByOutputPin,
  };

  // Prepare the new transition window.
  const transitionWindows = state.transitionWindows.slice();

  let index = binarySearch(transitionWindows, tick, (a, b) => a.tick - b);
  if (index < 0) {
    // Need to create a new window
    index = -index - 1;
    const newWindow: SimTransitionWindow = {
      tick,
      transitionIds: [],
    };
    transitionWindows.splice(index, 0, newWindow);
  }

  const transitionIds = transitionWindows[index].transitionIds.slice();
  transitionIds.push(transitionId);

  transitionWindows[index] = Object.assign({}, transitionWindows[index], {
    transitionIds,
  });

  const transitionsById = Object.assign({}, state.transitionsById, {
    [transitionId]: newTransition,
  });

  return Object.assign({}, state, {
    // Add the new transition window to the id mapping.
    transitionsById: transitionsById,
    transitionWindows,
  });
}

function removeTransitionsByNodeId(
  state: Readonly<SimulatorServiceState>,
  nodeId: string
): SimulatorServiceState {
  function isNodeTransition(transition: SimNodePinTransition) {
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

  const transitionWindowIndex = binarySearch(
    transitionWindows,
    transition.tick,
    (a, b) => a.tick - b
  );
  if (transitionWindowIndex >= 0) {
    const transitionWindow = transitionWindows[transitionWindowIndex];

    const tickWindowTransitionIndex = transitionWindow.transitionIds.indexOf(
      transitionId
    );
    if (tickWindowTransitionIndex !== -1) {
      if (transitionWindow.transitionIds.length === 1) {
        // Only one element left, remove the window.
        transitionWindows = dropIndexFp(
          transitionWindows,
          transitionWindowIndex
        );
      } else {
        // Remove the transition from the tick window.
        transitionWindows = transitionWindows.slice();
        const { transitionIds } = transitionWindows[transitionWindowIndex];
        transitionWindows[transitionWindowIndex] = Object.assign(
          {},
          transitionWindows[transitionWindowIndex],
          {
            transitionIds: dropIndexFp(
              transitionIds,
              tickWindowTransitionIndex
            ),
          }
        );
      }
    }
  }

  return Object.assign({}, state, {
    transitionsById,
    transitionWindows,
  });
}
