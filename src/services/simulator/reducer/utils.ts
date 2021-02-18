import binarySearch from "binary-search";
import { v4 as uuidV4 } from "uuid";
import findIndex from "lodash/findIndex";
import pick from "lodash/pick";

import { fpSet } from "@/utils";
import { asArray } from "@/arrays";
import { AppState } from "@/store";

import { inputPinsByPinIdFromSimulatorNodeIdSelector } from "@/services/simulator-graph/selectors/connections";
import {
  simulatorNodeIdsSelector,
  elementTypeFromSimulatorNodeId,
} from "@/services/simulator-graph/selectors/nodes";

import { SimulatorState, defaultSimulatorState } from "../state";
import {
  SimTransitionWindow,
  SimNodePinTransition as SimNodeTransition,
} from "../types";
import { ElementDefinitionsByType } from "@/elements";

export function simInit(
  state: SimulatorState,
  appState: AppState
): SimulatorState {
  const nodeIds = simulatorNodeIdsSelector(appState);

  state = defaultSimulatorState;

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
  state: SimulatorState,
  nodeId: string,
  appState: AppState
): SimulatorState {
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

export function collectNodeTransitions(
  state: SimulatorState,
  nodeId: string,
  appState: AppState
): SimulatorState {
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
  state: Readonly<SimulatorState>,
  nodeId: string,
  tick: number,
  valuesByOutputPin: Record<string, boolean>
): SimulatorState {
  const transitionId = uuidV4();

  const newTransition: SimNodeTransition = {
    transitionId: transitionId,
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
  state: Readonly<SimulatorState>,
  nodeId: string
): SimulatorState {
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
  state: Readonly<SimulatorState>,
  transitionId: string
): SimulatorState {
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
