import produce from "immer";

import { iterateTakeWhile } from "@/utils";

import { EvolveSimAction } from "../actions";
import { SimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./collect-transitions";

function evolveSimMutator(state: SimulatorState, action: EvolveSimAction) {
  const { tickCount } = action.payload;
  const {
    tick,
    nodesById,
    nodeOutputTransitionsByNodeId,
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

      // This should be safe if everything stays in sync.
      //  We only allow one transition per id, and this should be it.
      delete nodeOutputTransitionsByNodeId[nodeId][outputId];

      nodeOutputValuesByNodeId[nodeId][outputId] = value;

      for (const outConn of node.outputConnectionsByPin[outputId]) {
        updateNodes.add(outConn.nodeId);
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

export default produce(evolveSimMutator);
