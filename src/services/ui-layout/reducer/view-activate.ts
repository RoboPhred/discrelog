import get from "lodash/get";

import { isActivateViewAction } from "@/actions/view-activate";

import { createUiLayoutReducer, findDefaultActiveWindow } from "../utils";

export default createUiLayoutReducer((state, action) => {
  if (!isActivateViewAction(action)) {
    return state;
  }

  let { tesselPath } = action.payload;

  if (!get(state.layout, tesselPath)) {
    tesselPath = findDefaultActiveWindow(state.layout);
  }

  return {
    ...state,
    activeCircuitEditorPath: tesselPath,
  };
});
