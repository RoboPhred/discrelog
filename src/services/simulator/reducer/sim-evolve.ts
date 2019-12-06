import { AnyAction } from "redux";
import produce from "immer";

import { iterateTakeWhile } from "@/utils";

import { SimulatorState, defaultSimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { isEvolveSimAction } from "../actions/sim-evolve";

export default function simEvolveReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  return produce(state, draft => evolveSimMutator(draft, action));
}

function evolveSimMutator(state: SimulatorState, action: AnyAction) {
  if (!isEvolveSimAction(action)) {
    return;
  }

  const { tickCount } = action.payload;
  const {
    tick,
    nodesById,
    nodeOutputValuesByNodeId,
    transitionsById,
    transitionWindows
  } = state;

  const endTick = tick + tickCount;

  // For each window within our update range...
  const iterator = iterateTakeWhile(
    transitionWindows,
    window => window.tick <= endTick
  );

  let saftyCutoff = tickCount;

  for (const window of iterator) {
    // Update the current tick, as it is referenced
    //  during transition collection.
    state.tick = window.tick;

    const updateNodes = new Set<string>();

    for (const tid of window.transitionIds) {
      const { nodeId, outputId, value } = transitionsById[tid];

      const node = nodesById[nodeId];
      if (!node) {
        continue;
      }

      // Transition is now applied and no longer tracked, remove it from the list.
      delete transitionsById[tid];

      nodeOutputValuesByNodeId[nodeId][outputId] = value;

      // Add each node we output to, to the output list.
      const outputConnections = state.connections.filter(
        x => x.outputPin.nodeId === nodeId
      );
      for (const outConn of outputConnections) {
        updateNodes.add(outConn.inputPin.nodeId);
      }
    }

    for (const nodeId of updateNodes) {
      collectNodeTransitionsMutator(state, nodeId);
    }

    if (--saftyCutoff <= 0) {
      console.error(
        "Safty threshold exceeded for sim tick window consumption.  This indicates new windows are being created under the currently-executing tick."
      );
      break;
    }
  }

  // Zip the tick to the last tick we ran for.
  //  This may not be the last tick we performed, if there were no transitions
  //  between our last tick and desired end tick.
  state.tick = endTick;
}
