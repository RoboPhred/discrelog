import { AnyAction } from "redux";
import produce from "immer";
import find from "lodash/find";

import { SimulatorState, defaultSimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { nodePinEquals } from "../types";
import { isAttachWireAction } from "../actions/wire-attach";

import { pinsToConnection } from "./utils";

export default function wireAttachReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  if (!isAttachWireAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { inputPin } = conn;

  // Only one source per input.
  if (find(state.connections, c => nodePinEquals(c.inputPin, inputPin))) {
    return state;
  }

  state = {
    ...state,
    connections: [...state.connections, conn]
  };

  return produce(state, draft =>
    collectNodeTransitionsMutator(draft, inputPin.nodeId)
  );
}
