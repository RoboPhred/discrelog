import produce from "immer";

import { EvolveSimAction } from "../actions";
import { SimulatorState } from "../state";

import { applyTransitionsMutator } from "./apply-transitions";
import { collectTransitionsMutator } from "./collect-transitions";

export function evolveSimMutator(
  state: SimulatorState,
  action: EvolveSimAction
) {
  const { tickCount } = action.payload;
  const {
    tick,
    nodesById,
    nodeStatesByNodeId,
    nodeOutputValuesByNodeId,
    transitionWindows
  } = state;

  const endTick = tick + tickCount;

  // Collect transitions for dirty values.
  // Previous logic would always generate transitions when a node
  //  was touched.  This led to the buildup of redundant or contradictory
  //  transitions for a single tick.
  // We need to do this before checking the transitions,
  //  as we may have no pending transitions but dirty nodes.
  // TODO: Resolve this by allowing node reducers to view and override their pending transitions.
  collectTransitionsMutator(state);

  // For each window within our update range...
  const iterator = takeWhile(
    transitionWindows,
    window => window.tick <= endTick
  );
  for (const window of iterator) {
    // Update the current tick, as it is referenced
    //  during transition collection.
    state.tick = window.tick;

    // Collect transitions from dirty states.
    //  This is repeated from above, as this might be another loop
    //  through the iterator.
    collectTransitionsMutator(state);

    // Apply the transitions for this tick
    applyTransitionsMutator(state, window.transitionsByNodeId);
  }

  // Zip the tick to the last tick we ran for.
  //  This may not be the last tick we performed, if there were no transitions
  //  between our last tick and desired end tick.
  state.tick = endTick;
}

export default produce(evolveSimMutator);

function* takeWhile<T>(
  items: T[],
  predicate: (item: T) => boolean
): IterableIterator<T> {
  while (items.length > 0) {
    const item = items[0];
    if (!predicate(item)) {
      break;
    }
    yield items.pop()!;
  }
}

function popWhile<T>(items: T[], pickWhile: (item: T) => boolean): T[] {
  const result = [];
  for (const item of items) {
    if (!pickWhile(item)) {
      break;
    }
    result.push(item);
  }

  items.splice(0, result.length);

  return result;
}
