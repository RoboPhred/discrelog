import { AnyAction } from "redux";
import produce from "immer";

import { SimulatorState, defaultSimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { nodePinEquals } from "../types";
import { isDetatchWireNodeAction } from "../actions/wire-detatch";

import { pinsToConnection } from "./utils";

export default function wireDetatchReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  if (!isDetatchWireNodeAction(action)) {
    return state;
  }

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(state, p1, p2);
  if (!conn) {
    return state;
  }

  const { outputPin, inputPin } = conn;

  state = {
    ...state,
    connections: state.connections.filter(
      conn =>
        !(
          nodePinEquals(conn.inputPin, inputPin) &&
          nodePinEquals(conn.outputPin, outputPin)
        )
    )
  };

  return produce(state, draft =>
    collectNodeTransitionsMutator(draft, inputPin.nodeId)
  );
}
