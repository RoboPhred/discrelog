import { isHoverNodeAction } from "../actions/node-hover";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isHoverNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;
  return {
    ...state,
    mouseOverNodeId: nodeId
  };
});
