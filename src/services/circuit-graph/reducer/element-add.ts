import { AnyAction } from "redux";

import { reducerPriority, PRIORITY_PRE } from "@/store/priorities";

import { isAddElementAction } from "@/actions/element-add";

import { createCircuitGraphReducer } from "../utils";

export default reducerPriority(
  PRIORITY_PRE,
  createCircuitGraphReducer((state, action: AnyAction) => {
    if (!isAddElementAction(action)) {
      return state;
    }

    const { elementId, elementType, elementName, circuitId } = action.payload;
    return {
      ...state,
      elementsById: {
        ...state.elementsById,
        [elementId]: {
          elementType,
          elementName: elementName ?? null,
        },
      },
      elementIdsByCircuitId: {
        ...state.elementIdsByCircuitId,
        [circuitId]: [...state.elementIdsByCircuitId[circuitId], elementId],
      },
    };
  })
);
