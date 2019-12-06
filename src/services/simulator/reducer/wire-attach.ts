import { AnyAction } from "redux";
import produce from "immer";
import find from "lodash/find";

import { SimulatorState, defaultSimulatorState } from "../state";

import { collectNodeTransitionsMutator } from "./transition-utils";
import { nodePinEquals } from "../types";
import { isAttachWireAction } from "../actions/wire-attach";

export default function wireAttachReducer(
  state: SimulatorState = defaultSimulatorState,
  action: AnyAction
): SimulatorState {
  return produce(state, draft => wireNodeMutator(draft, action));
}

function wireNodeMutator(state: SimulatorState, action: AnyAction) {
  if (!isAttachWireAction(action)) {
    return;
  }

  const { outputPin, inputPin } = action.payload;

  const outputNode = state.nodesById[outputPin.nodeId];
  const inputNode = state.nodesById[inputPin.nodeId];

  if (!outputNode || !inputNode) {
    return;
  }

  // Only one source per input.
  if (find(state.connections, c => nodePinEquals(c.inputPin, inputPin))) {
    return;
  }

  state.connections.push({
    inputPin,
    outputPin
  });

  collectNodeTransitionsMutator(state, inputPin.nodeId);
}
