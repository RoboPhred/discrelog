import { isCircuitEditorReceiveFocusAction } from "@/actions/circuit-editor-receive-focus";

import { createCircuitEditorsReducer } from "../utils";

export default createCircuitEditorsReducer((state, action) => {
  if (!isCircuitEditorReceiveFocusAction(action)) {
    return state;
  }

  const { editorId } = action.payload;

  if (Object.keys(state.circucitEditorsById).indexOf(editorId) === -1) {
    return state;
  }

  return {
    ...state,
    activeEditorId: editorId,
  };
});
