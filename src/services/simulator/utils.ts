import { AnyAction, Reducer } from "redux";
import find from "lodash/find";

import { AppState, defaultAppState } from "@/store";
import { fpSet } from "@/utils";
import { NodeTypes } from "@/node-defs";
import { NodePin, Connection } from "@/types";

import { SimulatorState } from "./state";

export interface SimulatorReducer {
  (state: SimulatorState, action: AnyAction): SimulatorState;
}

export function createSimulatorReducer(
  reducer: SimulatorReducer
): Reducer<AppState, AnyAction> {
  return (state: AppState = defaultAppState, action: AnyAction) => {
    const newState = reducer(state.services.simulator, action);
    if (state.services.simulator != newState) {
      return fpSet(state, "services", "simulator", newState);
    }
    return state;
  };
}

export interface SimulatorSelectorA0<TReturn> {
  (s: AppState): TReturn;
  local(s: SimulatorState): TReturn;
}

export interface SimulatorSelectorA1<TA1, TReturn> {
  (s: AppState, a1: TA1): TReturn;
  local(s: SimulatorState, a1: TA1): TReturn;
}

const simulatorStateSelector = (s: AppState) => s.services.simulator;
export function createSimulatorSelector<TReturn>(
  selector: (s: SimulatorState) => TReturn
): SimulatorSelectorA0<TReturn>;
export function createSimulatorSelector<TA1, TReturn>(
  selector: (s: SimulatorState, a1: TA1) => TReturn
): SimulatorSelectorA1<TA1, TReturn>;
export function createSimulatorSelector<TArgs, TReturn>(
  selector: (s: SimulatorState, ...args: TArgs[]) => TReturn
): SimulatorSelectorA1<TArgs, TReturn> {
  const appSelector: any = (s: AppState, ...args: TArgs[]) =>
    selector(simulatorStateSelector(s), ...args);
  appSelector.local = selector;
  return appSelector;
}

/**
 * Check two pins to see if they can form a valid connection.
 * Returns null if no connection can be made (both inputs or both outputs)
 *
 * Does not check to see if the pins are already connected, or other connections prevent this connection from forming.
 */
export function pinsToConnection(
  state: SimulatorState,
  p1: NodePin,
  p2: NodePin
): Connection | null {
  const p1Node = state.nodesById[p1.nodeId];
  const p2Node = state.nodesById[p2.nodeId];

  if (!p1Node || !p2Node) {
    return null;
  }

  const p1Def = NodeTypes[p1Node.type];
  const p2Def = NodeTypes[p2Node.type];

  if (!p1Def || !p2Def) {
    return null;
  }

  const p1Pin = find(p1Def.pins, x => x.name == p1.pinId);
  const p2Pin = find(p2Def.pins, x => x.name == p2.pinId);

  if (!p1Pin || !p2Pin) {
    return null;
  }

  // Pins are in same direction and cannot be connected.
  if (p1Pin.direction === p2Pin.direction) {
    return null;
  }

  const outputPin = p1Pin.direction === "output" ? p1 : p2;
  const inputPin = p1Pin.direction === "input" ? p1 : p2;

  return {
    outputPin,
    inputPin
  };
}
