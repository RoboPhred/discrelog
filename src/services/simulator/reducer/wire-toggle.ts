import { AnyAction } from "redux";
import find from "lodash/find";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { nodePinEquals } from "../types";
import { isToggleWireAction } from "../actions/wire-toggle";
import { attachWire } from "../actions/wire-attach";
import { detatchWire } from "../actions/wire-detatch";

import { pinsToConnection } from "./utils";

export default function wireToggleReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isToggleWireAction(action)) {
    return state;
  }

  const simulatorState = state.services.simulator;

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(simulatorState, p1, p2);
  if (!conn) {
    return state;
  }

  const { outputPin, inputPin } = conn;

  const isWired =
    find(
      simulatorState.connections,
      c =>
        nodePinEquals(outputPin, c.outputPin) &&
        nodePinEquals(inputPin, c.inputPin)
    ) != null;

  if (isWired) {
    const { p1, p2 } = action.payload;
    return rootReducer(state, detatchWire(p1, p2));
  } else {
    const { p1, p2 } = action.payload;
    return rootReducer(state, attachWire(p1, p2));
  }
}
