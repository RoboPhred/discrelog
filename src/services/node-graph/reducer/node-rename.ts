import { AnyAction } from "redux";

import { isRenameNodeAction } from "@/actions/node-rename";

import { createNodeGraphReducer } from "../utils";

export default createNodeGraphReducer((state, action: AnyAction) => {
  if (!isRenameNodeAction(action)) {
    return state;
  }

  const { nodeId } = action.payload;
  if (!state.nodesById[nodeId]) {
    return state;
  }

  let nodeName: string | null = action.payload.nodeName;
  if (!nodeName && nodeName.trim() === "") {
    nodeName = null;
  }

  return {
    ...state,
    nodesById: {
      ...state.nodesById,
      [nodeId]: {
        ...state.nodesById[nodeId],
        nodeName: nodeName,
      },
    },
  };
});
