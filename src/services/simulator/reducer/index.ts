import { SimulatorState, defaultSimulatorState } from "../state";

import {
  SimulatorAction,
  ACTION_WIRE,
  ACTION_UNWIRE,
  ACTION_TOGGLEWIRE,
  ACTION_EVOLVE,
  ACTION_FASTFORWARD,
  ACTION_INTERACT,
  ACTION_NODE_ADD
} from "../actions";

import { isWired } from "../helpers";

import addNodeReducer from "./add-node";
import wireNodeReducer from "./wire-node";
import unwireNodeReducer from "./unwire-node";
import interactNodeReducer from "./interact-node";
import evolveSimReducer from "./evolve-sim";
import fastForwardReducer from "./fast-forward-sim";

export default function simulatorReducer(
  state: SimulatorState = defaultSimulatorState,
  action: SimulatorAction
): SimulatorState {
  switch (action.type) {
    case ACTION_NODE_ADD:
      return addNodeReducer(state, action);
    case ACTION_WIRE:
      return wireNodeReducer(state, action);
    case ACTION_UNWIRE:
      return unwireNodeReducer(state, action);
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
        return unwireNodeReducer(state, {
          type: ACTION_UNWIRE,
          payload: action.payload
        });
      } else {
        return wireNodeReducer(state, {
          type: ACTION_WIRE,
          payload: action.payload
        });
      }
    case ACTION_INTERACT:
      return interactNodeReducer(state, action);
    case ACTION_EVOLVE:
      return evolveSimReducer(state, action);
    case ACTION_FASTFORWARD:
      return fastForwardReducer(state, action);
  }
  return state;
}
