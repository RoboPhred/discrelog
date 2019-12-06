import produce from "immer";
import find from "lodash/find";

import { SimulatorState } from "../state";
import { WireNodeAction } from "../actions";

import { collectNodeTransitionsMutator } from "./collect-transitions";
import { nodePinEquals } from "../types";

function wireNodeMutator(state: SimulatorState, action: WireNodeAction) {
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

  collectNodeTransitionsMutator(state, inputPin.nodeId);
}

export default produce(wireNodeMutator);
