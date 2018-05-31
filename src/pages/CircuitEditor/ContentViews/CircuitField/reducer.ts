import {
  CircuitFieldAction,
  ACTION_DRAG_START,
  ACTION_DRAG_CONTINUE,
  ACTION_DRAG_END
} from "./actions";
import { CircuitFieldState, defaultCircuitFieldState } from "./state";

export default function circuitFieldReducer(
  state: CircuitFieldState = defaultCircuitFieldState,
  action: CircuitFieldAction
): CircuitFieldState {
  switch (action.type) {
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
