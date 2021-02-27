import { isViewNodeNamesAction } from "@/actions/view-node-names";
import { createCircuitEditorUiSettingsReducer } from "../utils";

export default createCircuitEditorUiSettingsReducer((state, action) => {
  if (!isViewNodeNamesAction(action)) {
    return state;
  }

  const { mode } = action.payload;
  return {
    ...state,
    nodeNameMode: mode,
  };
});
