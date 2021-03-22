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

    const {
      elementId: id,
      elementType: elementType,
      elementName: elementName,
    } = action.payload;
    return {
      ...state,
      elementsById: {
        ...state.elementsById,
        [id]: {
          elementType,
          elementName: elementName ?? null,
        },
      },
    };
  })
);
