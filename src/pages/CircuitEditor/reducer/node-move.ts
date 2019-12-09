import mapValues from "lodash/mapValues";
import pick from "lodash/pick";

import { pointAdd } from "@/geometry";

import { isMoveNodesAction } from "../actions/node-move";

import { createEditorReducer } from "./utils";
import { CLIPBOARD_PASTE_OFFSET } from "./clipboard-paste";

export default createEditorReducer((state, action) => {
  if (!isMoveNodesAction(action)) {
    return state;
  }
  const { nodeIds, offsetX, offsetY } = action.payload;
  if (nodeIds.length === 0) {
    return state;
  }

  const movedPositions = mapValues(pick(state.nodePositions, nodeIds), p => ({
    x: p.x + offsetX,
    y: p.y + offsetY
  }));

  return {
    ...state,
    nodePositions: {
      ...state.nodePositions,
      ...movedPositions
    },
    clipboardOrigin: state.clipboardOrigin
      ? pointAdd(movedPositions[nodeIds[0]], CLIPBOARD_PASTE_OFFSET)
      : null
  };
});
