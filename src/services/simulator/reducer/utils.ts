import binarySearch from "binary-search";
import { v4 as uuidV4 } from "uuid";
import pick from "lodash/pick";
import difference from "lodash/difference";

import { fpSet } from "@/utils";
import { asArray, dropIndexFp } from "@/arrays";
import { AppState } from "@/store";
import { EvolutionResult, OutputTransition } from "@/logic";

import {
  inputPinsByPinIdFromEvolverIdSelector,
  outputEvolverIdsFromEvolverIdSelector,
} from "@/services/simulator-graph/selectors/connections";
import {
  evolverIdsSelector,
  evolverDefFromEvolverId,
} from "@/services/simulator-graph/selectors/elements";

import { SimulatorServiceState, defaultSimulatorServiceState } from "../state";
import { SimTransitionWindow, EvolverPinTransition } from "../types";

export function simInit(
  state: Readonly<SimulatorServiceState>,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const elementIds = evolverIdsSelector(appState);

  state = defaultSimulatorServiceState;

  state = elementIds.reduce(
    (state, elementId) => initNode(state, elementId, appState),
    state
  );

  state = elementIds.reduce(
    (state, elementId) => collectNodeTransitions(state, elementId, appState),
    state
  );

  return Object.assign({}, state, { initialized: true });
}

function initNode(
  state: Readonly<SimulatorServiceState>,
  elementId: string,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const def = evolverDefFromEvolverId(appState, elementId);
  if (!def) {
    return state;
  }

  const outputValues: Record<string, boolean> = {};
  def.outputPins.forEach((output) => {
    outputValues[output] = false;
  });

  return fpSet(
    state,
    "evolverOutputValuesByEvolverId",
    elementId,
    outputValues
  );
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
    state = Object.assign({}, state, {
      tick: endTick,
    });
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
    evolverOutputValuesByEvolverId: Object.assign(
      {},
      readonlyState.evolverOutputValuesByEvolverId
    ),
  }) as SimulatorServiceState;

  // Could benefit from being changed to a Set, although elements usually arent hooked up to too many
  //  outputs at a time.
  const updatedEvolverIds = new Set<string>();
  window.transitionIds.forEach((tid) => {
    const { elementId, valuesByOutputPin } = state.transitionsById[tid];

    if (
      !isOutputsUpdated(
        state.evolverOutputValuesByEvolverId[elementId],
        valuesByOutputPin
      )
    ) {
      // Values are unchanged from current, evolver will not update.
      return;
    }

    // evolverOutputValuesByEvolverId is pre-cloned
    state.evolverOutputValuesByEvolverId[elementId] = Object.assign(
      {},
      state.evolverOutputValuesByEvolverId[elementId],
      valuesByOutputPin
    );

    // Add each evolver we output to, to the output list.
    const outputEvolverIds = outputEvolverIdsFromEvolverIdSelector(
      appState,
      elementId
    );
    outputEvolverIds.forEach((evolverId) => updatedEvolverIds.add(evolverId));
  });

  // Remove all window transitions as they have been consumed.
  // State is cloned above
  state.transitionsById = pick(
    state.transitionsById,
    difference(Object.keys(state.transitionsById), window.transitionIds)
  );

  for (const elementId of updatedEvolverIds) {
    state = collectNodeTransitions(state, elementId, appState);
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
  elementId: string,
  appState: Readonly<AppState>
): SimulatorServiceState {
  const def = evolverDefFromEvolverId(appState, elementId);
  if (!def || !def.evolve) {
    return state;
  }

  // Build the current input state from the connected pins.
  const inputs = collectNodeInputs(state, elementId, appState);
  const result = def.evolve(
    state.evolverStatesByEvolverId[elementId],
    inputs,
    state.tick
  );

  return applyEvolutionResult(state, elementId, result);
}

export function applyEvolutionResult(
  state: Readonly<SimulatorServiceState>,
  elementId: string,
  evolutionResult: EvolutionResult
) {
  const { state: evolverState, transitions } = evolutionResult;

  if (evolverState) {
    state = fpSet(state, "evolverStatesByEvolverId", elementId, evolverState);
  }

  if (transitions) {
    const transitionsArray = asArray(transitions);
    state = transitionsArray.reduce(
      (state, transition, i) =>
        applyOutputTransition(
          state,
          elementId,
          transition,
          i === 0 ? "replace" : "append"
        ),
      state
    );
  }

  return state;
}

function collectNodeInputs(
  state: Readonly<SimulatorServiceState>,
  elementId: string,
  appState: Readonly<AppState>
): Record<string, boolean> {
  // Build the current input state from the connected pins.
  const inputs: Record<string, boolean> = {};
  const inputSourcesByPin = inputPinsByPinIdFromEvolverIdSelector(
    appState,
    elementId
  );

  Object.keys(inputSourcesByPin).forEach((inputPin) => {
    const inputConn = inputSourcesByPin[inputPin];
    if (!inputConn) {
      inputs[inputPin] = false;
      return;
    }

    const { evolverId, pinId: sourcePinId } = inputConn;
    inputs[inputPin] =
      state.evolverOutputValuesByEvolverId[evolverId]?.[sourcePinId] || false;
  });

  return inputs;
}

function applyOutputTransition(
  state: Readonly<SimulatorServiceState>,
  elementId: string,
  transition: OutputTransition,
  defaultMerger: "replace" | "append" = "replace"
): SimulatorServiceState {
  const {
    tickOffset,
    valuesByPin,
    transitionMerger = defaultMerger,
  } = transition;

  // Sanity check that we are not producing transitions for the past or current tick.
  const transitionTick = state.tick + (tickOffset > 0 ? tickOffset : 1);

  // We originally removed old transitions when scheduling new transitions.
  //  Experimenting without this.
  if (transitionMerger === "replace") {
    state = removeTransitionsByEvolverId(state, elementId);
  }

  return addTransition(state, elementId, transitionTick, valuesByPin);
}

function addTransition(
  state: Readonly<SimulatorServiceState>,
  elementId: string,
  tick: number,
  valuesByOutputPin: Record<string, boolean>
): SimulatorServiceState {
  const transitionId = uuidV4();

  const newTransition: EvolverPinTransition = {
    elementId,
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
    transitionsById,
    transitionWindows,
  });
}

function removeTransitionsByEvolverId(
  state: Readonly<SimulatorServiceState>,
  elementId: string
): SimulatorServiceState {
  function isElementTransition(transition: EvolverPinTransition) {
    return transition.elementId === elementId;
  }

  const transitionIds = Object.keys(state.transitionsById).filter((id) =>
    isElementTransition(state.transitionsById[id])
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
    const { transitionIds } = transitionWindow;

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
