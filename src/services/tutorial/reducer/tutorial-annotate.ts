import { asArray } from "@/arrays";

import { isTutorialAnnotateAction } from "@/actions/tutorial-annotate";

import { createTutorialReducer } from "../utils";

export default createTutorialReducer((state, action) => {
  if (!isTutorialAnnotateAction(action)) {
    return state;
  }

  const { annotations } = action.payload;

  return {
    ...state,
    annotatedElements: asArray(annotations),
  };
});
