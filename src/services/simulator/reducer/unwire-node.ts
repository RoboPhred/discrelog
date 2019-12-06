import produce from "immer";
import findIndex from "lodash/findIndex";

import { SimulatorState } from "../state";
import { UnwireNodeAction } from "../actions";

import { collectNodeTransitionsMutator } from "./collect-transitions";
import { nodePinEquals } from "../types";

function unwireNodeMutator(state: SimulatorState, action: UnwireNodeAction) {
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

export default produce(unwireNodeMutator);
