import { AnyAction } from "redux";
import find from "lodash/find";

import { SimulatorState, defaultSimulatorState } from "../state";
import { nodePinEquals } from "../types";
import { isToggleWireAction } from "../actions/wire-toggle";
import { ACTION_WIRE_DETATCH } from "../actions/wire-detatch";
import { ACTION_WIRE_ATTACH } from "../actions/wire-attach";

import wireDetatchReducer from "./wire-detatch";
import wireAttachReducer from "./wire-attach";

export default function toggleWireReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  if (!isToggleWireAction(action)) {
    return state;
  }

  const { inputPin, outputPin } = action.payload;

  const isWired =
    find(
      state.connections,
      c =>
        nodePinEquals(outputPin, c.outputPin) &&
        nodePinEquals(inputPin, c.inputPin)
    ) != null;

  if (isWired) {
    return wireDetatchReducer(state, {
      type: ACTION_WIRE_DETATCH,
      payload: action.payload
    });
  } else {
    return wireAttachReducer(state, {
      type: ACTION_WIRE_ATTACH,
      payload: action.payload
    });
  }
}
