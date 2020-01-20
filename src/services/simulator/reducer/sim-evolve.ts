import pick from "lodash/pick";
import difference from "lodash/difference";

import { AppState } from "@/store";
import { isTickSimAction } from "@/actions/sim-tick";
import { nodeOutputWiresFromNodeIdSelector } from "@/services/graph/selectors/wires";

import { SimulatorState } from "../state";
import { SimTransitionWindow } from "../types";

import { collectNodeTransitions } from "./utils";
import { createSimulatorReducer } from "../utils";

export default createSimulatorReducer((state, action, appState) => {
  if (!isTickSimAction(action)) {
    return state;
  }

  const { tickCount } = action.payload;

  const endTick = state.tick + tickCount;

  // We cannot grab the windows ahead of time, as some windows might generate more windows
  //  for future ticks.

  // Pre-clone windows as we wil be repeatedly modifying it.
  state = {
    ...state,
    transitionWindows: [...state.transitionWindows]
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
      tick: endTick
    };
  }

  return state;
});

function tickWindow(
  state: SimulatorState,
  window: SimTransitionWindow,
  appState: AppState
): SimulatorState {
  // Update the current tick, as it is referenced
  //  during transition collection.
  state = {
    ...state,
    tick: window.tick,
    // pre-clone outputs for mutation below
    nodeOutputValuesByNodeId: {
      ...state.nodeOutputValuesByNodeId
    }
  };

  let updatedNodes = [];
  for (const tid of window.transitionIds) {
    const { nodeId, valuesByOutputPin } = state.transitionsById[tid];

    // nodeOutputValuesByNodeId is pre-cloned
    state.nodeOutputValuesByNodeId[nodeId] = {
      ...state.nodeOutputValuesByNodeId[nodeId],
      ...valuesByOutputPin
    };

    // Add each node we output to, to the output list.
    const outputWires = nodeOutputWiresFromNodeIdSelector(appState, nodeId);
    for (const outConn of outputWires) {
      const nodeId = outConn.inputPin.nodeId;
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
