import {
  SelectNodesAction,
  ACTION_SELECT_NODES
} from "../../actions/select-nodes";
import {
  ClearSelectionAction,
  ACTION_SELECT_CLEAR
} from "../../actions/select-clear";
import {
  SelectRegionAction,
  ACTION_SELECT_REGION
} from "../../actions/select-region";

import {
  CircuitFieldAction,
  ACTION_DRAG_START,
  ACTION_DRAG_CONTINUE,
  ACTION_DRAG_END,
  ACTION_SELECT_PIN
} from "./actions";
import { CircuitFieldState, defaultCircuitFieldState } from "./state";

export default function circuitFieldReducer(
  state: CircuitFieldState = defaultCircuitFieldState,
  action:
    | CircuitFieldAction
    | SelectNodesAction
    | ClearSelectionAction
    | SelectRegionAction
): CircuitFieldState {
  switch (action.type) {
    case ACTION_SELECT_REGION:
    case ACTION_SELECT_NODES:
    case ACTION_SELECT_CLEAR: {
      return {
        ...state,
        selectedPin: null
      };
    }
    case ACTION_SELECT_PIN: {
      const { nodeId, pinId } = action.payload;
      return {
        ...state,
        selectedPin: {
          nodeId,
          pinId
        }
      };
    }
    case ACTION_DRAG_START: {
      const { dragMode, x, y } = action.payload;
      return {
        ...state,
        dragMode,
        dragStart: {
          x,
          y
        }
      };
    }
    case ACTION_DRAG_CONTINUE: {
      const { x, y } = action.payload;
      return {
        ...state,
        dragEnd: {
          x,
          y
        }
      };
    }
    case ACTION_DRAG_END: {
      return {
        ...state,
        dragMode: null,
        dragStart: null,
        dragEnd: null
      };
    }
  }
  return state;
}
