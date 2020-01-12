import binarySearch from "binary-search";
import uuidV4 from "uuid/v4";
import find from "lodash/find";
import findIndex from "lodash/findIndex";
import pick from "lodash/pick";
import mapValues from "lodash/mapValues";

import { fpSet } from "@/utils";
import { IDMap } from "@/types";
import { AppState } from "@/store";

import { inputsOf, outputsOf } from "@/node-defs/utils";

import { nodeInputConnectionsByPinSelector } from "@/services/graph/selectors/connections";
import {
  nodeDefSelector,
  nodeIdsSelector
} from "@/services/graph/selectors/nodes";
import { NodePin } from "@/services/graph/types";

import { SimulatorState, defaultSimulatorState } from "../state";
import { SimTransitionWindow, SimNodePinTransition } from "../types";
import { nodeOutputPinValue } from "../selectors/nodes";

export function simInit(
  state: SimulatorState,
  appState: AppState
): SimulatorState {
  // Switching away from edit mode, initialize the simulator.
  const nodeIds = nodeIdsSelector(appState);

  state = {
    ...defaultSimulatorState,
    ticksPerSecond: state.ticksPerSecond
  };

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
  const def = nodeDefSelector(appState, nodeId);
  if (!def) {
    return state;
  }

  const inputs = inputsOf(def);
  const outputs = outputsOf(def);

  const { state: nodeState = null, transitions = null } = def.evolve
    ? def.evolve(
        undefined,
        mapValues(inputs, () => false),
        state.tick
      )
    : {};

  const outputValues = transitions
    ? mapValues(transitions, x => x.value)
    : mapValues(outputs, () => false);

  return {
    ...state,
    nodeStatesByNodeId: {
      ...state.nodeStatesByNodeId,
      [nodeId]: nodeState
    },
    nodeOutputValuesByNodeId: {
      ...state.nodeOutputValuesByNodeId,
      [nodeId]: outputValues
    }
  };
}

export function collectNodeTransitions(
  state: SimulatorState,
  nodeId: string,
  appState: AppState
): SimulatorState {
  const def = nodeDefSelector(appState, nodeId);
  if (!def || !def.evolve) {
    return state;
  }

  // Build the current input state from the connected pins.
  const inputs: IDMap<boolean> = {};
  const inputConnectionsByPin = nodeInputConnectionsByPinSelector(
    appState,
    nodeId
  );

  for (const inputPin of Object.keys(inputConnectionsByPin)) {
    const inputConn = inputConnectionsByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      continue;
    }
    const { nodeId: sourceNodeId, pinId: sourcePin } = inputConn;

    inputs[inputPin] = nodeOutputPinValue.local(state, sourceNodeId, sourcePin);
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
    const nodeOutputs = state.nodeOutputValuesByNodeId[nodeId] || {};
    for (const outputId of Object.keys(result.transitions)) {
      const { tickOffset, value } = result.transitions[outputId];

      // Sanity check that we are not producing transitions for the past or current tick.
      const transitionTick = state.tick + (tickOffset > 0 ? tickOffset : 1);

      state = removeTransitionByPin(state, {
        nodeId: nodeId,
        pinId: outputId
      });

      if (nodeOutputs[outputId] !== value) {
        state = addTransition(state, nodeId, outputId, transitionTick, value);
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
            ...transitionIds.slice(tickWindowTransitionIndex + 1)
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
