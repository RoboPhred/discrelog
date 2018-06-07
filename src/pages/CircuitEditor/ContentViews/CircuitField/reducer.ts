import {
  ACTION_SELECT_NODES,
  ACTION_SELECT_CLEAR,
  ACTION_SELECT_REGION,
  SelectNodesAction,
  SelectRegionAction,
  ClearSelectionAction
} from "@/pages/CircuitEditor/actions";

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
      const { nodeId, pinDirection, pinId } = action.payload;
      return {
        ...state,
        selectedPin: {
          nodeId,
          direction: pinDirection,
          pin: pinId
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
