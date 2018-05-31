import { SimulatorState, defaultSimulatorState } from "../state";

import {
  SimulatorAction,
  ACTION_WIRE,
  ACTION_UNWIRE,
  ACTION_TOGGLEWIRE,
  ACTION_EVOLVE,
  ACTION_INTERACT,
  ACTION_NODE_ADD
} from "../actions";

import { isWired } from "../helpers";

import addNodeAction from "./add-node";
import wireNodeAction from "./wire-node";
import unwireNodeAction from "./unwire-node";
import interactNodeAction from "./interact-node";
import evolveSimAction from "./evolve-sim";

export default function simulatorReducer(
  state: SimulatorState = defaultSimulatorState,
  action: SimulatorAction
): SimulatorState {
  switch (action.type) {
    case ACTION_NODE_ADD:
      return addNodeAction(state, action);
    case ACTION_WIRE:
      return wireNodeAction(state, action);
    case ACTION_UNWIRE:
      return unwireNodeAction(state, action);
    case ACTION_TOGGLEWIRE:
      const {
        sourceNodeId,
        sourcePin,
        targetNodeId,
        targetPin
      } = action.payload;
      if (
        isWired(
          state.nodesById,
          { nodeId: sourceNodeId, pin: sourcePin },
          { nodeId: targetNodeId, pin: targetPin }
        )
      ) {
        return unwireNodeAction(state, {
          type: ACTION_UNWIRE,
          payload: action.payload
        });
      } else {
        return wireNodeAction(state, {
          type: ACTION_WIRE,
          payload: action.payload
        });
      }
    case ACTION_INTERACT:
      return interactNodeAction(state, action);
    case ACTION_EVOLVE:
      return evolveSimAction(state, action);
  }
  return state;
}
