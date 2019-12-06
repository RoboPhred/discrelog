import mapValues from "lodash/mapValues";

import { AppState } from "@/store";

import { NodeTypes } from "./node-types";
import { NodePin } from "./types";
import { SimulatorState } from "./state";

export interface SimulatorSelector<TReturn> {
  (s: AppState): TReturn;
  local(s: SimulatorState): TReturn;
}

export interface SimulatorSelectorWithArgs<TArgs, TReturn> {
  (s: AppState, ...args: TArgs[]): TReturn;
  local(s: SimulatorState, ...args: TArgs[]): TReturn;
}

const simulatorStateSelector = (s: AppState) => s.services.simulator;
function createSelector<TReturn>(
  selector: (s: SimulatorState) => TReturn
): SimulatorSelector<TReturn>;
function createSelector<TArgs, TReturn>(
  selector: (s: SimulatorState, ...args: TArgs[]) => TReturn
): SimulatorSelectorWithArgs<TArgs, TReturn>;
function createSelector<TArgs, TReturn>(
  selector: (s: SimulatorState, ...args: TArgs[]) => TReturn
): SimulatorSelectorWithArgs<TArgs, TReturn> {
  const appSelector: any = (s: AppState, ...args: TArgs[]) =>
    selector(simulatorStateSelector(s), ...args);
  appSelector.local = selector;
  return appSelector;
}

export const nodesByIdSelector = createSelector(s => s.nodesById);
export const nodeSelector = createSelector(
  (s: SimulatorState, nodeId: string) => s.nodesById[nodeId] || null
);

export const nodeTypesByIdSelector = createSelector(s =>
  mapValues(nodesByIdSelector.local(s), n => n.type)
);

export const nodeDefsByIdSelector = createSelector(s =>
  mapValues(nodeTypesByIdSelector.local(s), type => NodeTypes[type] || null)
);

export const nodeStatesByIdSelector = createSelector(s => s.nodeStatesByNodeId);

export const nodeOutputValuesByNodeIdSelector = createSelector(
  s => s.nodeOutputValuesByNodeId
);

export const connectionsSelector = createSelector(s => s.connections);

// TODO: memoize based on nodeId
/**
 * Gets an object mapping input pin names to their connection source pins.
 */
export const nodeInputConnectionsByPinSelector = createSelector(
  (s: SimulatorState, nodeId: string) => {
    const { connections } = s;

    const node = nodeSelector.local(s, nodeId);
    const def = NodeTypes[node.type];

    let inputPins: string[] = [];
    if (def) {
      inputPins = Object.keys(def.pins).filter(
        x => def.pins[x].direction === "input"
      );
    }

    const inputConnections = connections.filter(
      x => x.inputPin.nodeId === nodeId
    );

    const result: Record<string, NodePin | null> = {};
    for (const pin of inputPins) {
      result[pin] = null;
    }

    for (const connection of inputConnections) {
      const { outputPin, inputPin } = connection;
      result[inputPin.pin] = outputPin;
    }

    return result;
  }
);

// TODO: memoize based on nodeId
/**
 * Gets an object mapping output pin names to their connection target pins.
 */
export const nodeOutputConnectionsByPinSelector = createSelector(
  (s: SimulatorState, nodeId: string) => {
    const { connections } = s;

    const node = nodeSelector.local(s, nodeId);
    const def = NodeTypes[node.type];

    let outputPins: string[] = [];
    if (def) {
      outputPins = Object.keys(def.pins).filter(
        x => def.pins[x].direction === "output"
      );
    }

    const outputConnections = connections.filter(
      x => x.outputPin.nodeId === nodeId
    );

    const result: Record<string, NodePin[]> = {};
    for (const pin of outputPins) {
      result[pin] = [];
    }

    for (const connection of outputConnections) {
      const { outputPin, inputPin } = connection;
      result[outputPin.pin].push(inputPin);
    }

    return result;
  }
);
