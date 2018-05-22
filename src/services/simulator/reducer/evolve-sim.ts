import produce from "immer";

import { EvolveSimAction } from "../actions";
import { SimulatorState } from "../state";

import { evolveNode } from "../helpers";

export function evolveSimMutator(state: SimulatorState, action: EvolveSimAction) {
  const { tickCount } = action.payload;
  const {
    tick,
    nodesById,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    transitionWindows
  } = state;

  const endTick = tick + tickCount;

  // For each window within our update range...
  const windows = popWhile(transitionWindows, x => x.tick <= endTick);
  for (const window of windows) {
    const tick = window.tick;
    const evolveNodes = new Set<string>();

    // Update the current tick.  It will be referenced
    //  by evolveNode when determining when to schedule
    //  future transitions.
    state.tick = window.tick;

    // apply the transitions for this tick window.
    for (const transition of window.transitions) {
      const { nodeId, outputPinId, value } = transition;
      const node = nodesById[nodeId];
      if (!node) {
        continue;
      }

      if (nodeOutputValuesByNodeId[nodeId][outputPinId] !== value) {
        // Track what nodes we need to evolve as a result of this state change.
        nodeOutputValuesByNodeId[nodeId][outputPinId] = value;
        const targetNodes = node.outputConnectionsByPin[outputPinId];
        targetNodes.forEach(conn => evolveNodes.add(conn.nodeId));
      }
    }

    // Evolve affected nodes.
    for (const nodeId of evolveNodes) {
      evolveNode(state, nodeId);
    }
  }

  state.tick = endTick;
}

export default produce(evolveSimMutator);

function popWhile<T>(items: T[], pickWhile: (item: T) => boolean): T[] {
  const result = [];
  while (items.length > 0) {
    const item = items.pop()!;
    if (!pickWhile(item)) {
      items.unshift(item);
      break;
    }
    result.push(item);
  }

  return result;
}
