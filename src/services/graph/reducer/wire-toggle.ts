import { AnyAction } from "redux";
import find from "lodash/find";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isToggleWireAction } from "@/actions/wire-toggle";

import { attachWire } from "@/actions/wire-attach";
import { detatchWire } from "@/actions/wire-detatch";

import { nodePinEquals } from "../types";
import { pinsToConnection } from "../utils";

export default function wireToggleReducer(
  state: AppState = defaultAppState,
  action: AnyAction
) {
  if (!isToggleWireAction(action)) {
    return state;
  }

  const graphState = state.services.graph;

  const { p1, p2 } = action.payload;
  const conn = pinsToConnection(graphState, p1, p2);
  if (!conn) {
    return state;
  }

  const { outputPin, inputPin } = conn;

  const isWired =
    find(
      graphState.connections,
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
