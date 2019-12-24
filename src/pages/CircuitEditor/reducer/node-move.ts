import { isMoveNodesAction } from "@/actions/node-move";

import { createEditorReducer } from "./utils";

export default createEditorReducer((state, action) => {
  if (!isMoveNodesAction(action)) {
    return state;
  }
  const { nodeIds } = action.payload;
  if (nodeIds.length === 0) {
    return state;
  }

  return {
    ...state,

    // FIXME: Change node-move to use absolute coords rather than offsets,
    //  and set clipboard origin to that.
    clipboardOrigin: state.clipboardOrigin
      ? { x: 10, y: 10 } //pointAdd(movedPositions[nodeIds[0]], CLIPBOARD_PASTE_OFFSET)
      : null
  };
});
