import { AnyAction } from "redux";
import produce from "immer";
import findIndex from "lodash/findIndex";

import { SimulatorState, defaultSimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { nodePinEquals } from "../types";
import { isDetatchWireNodeAction } from "../actions/wire-detatch";

export default function wireDetatchReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  return produce(state, draft => unwireNodeMutator(draft, action));
}

function unwireNodeMutator(state: SimulatorState, action: AnyAction) {
  if (!isDetatchWireNodeAction(action)) {
    return;
  }

  const { outputPin, inputPin } = action.payload;

  const connectionIndex = findIndex(
    state.connections,
    c =>
      nodePinEquals(c.inputPin, inputPin) &&
      nodePinEquals(c.outputPin, outputPin)
  );

  if (connectionIndex !== -1) {
    state.connections.splice(connectionIndex, 1);
  }

  collectNodeTransitionsMutator(state, inputPin.nodeId);
}
