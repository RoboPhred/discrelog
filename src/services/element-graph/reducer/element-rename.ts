import { AnyAction } from "redux";

import { isRenameElementAction } from "@/actions/element-rename";

import { createElementGraphReducer } from "../utils";

export default createElementGraphReducer((state, action: AnyAction) => {
  if (!isRenameElementAction(action)) {
    return state;
  }

  const { elementId } = action.payload;
  if (!state.elementsById[elementId]) {
    return state;
  }

  let elementName: string | null = action.payload.elementName;
  if (!elementName && elementName.trim() === "") {
    elementName = null;
  }

  return {
    ...state,
    elementsById: {
      ...state.elementsById,
      [elementId]: {
        ...state.elementsById[elementId],
        elementName: elementName,
      },
    },
  };
});
