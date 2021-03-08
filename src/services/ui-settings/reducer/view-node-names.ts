import { isViewNodeNamesAction } from "@/actions/view-node-names";
import { createUiSettingsReducer } from "../utils";

export default createUiSettingsReducer((state, action) => {
  if (!isViewNodeNamesAction(action)) {
    return state;
  }

  const { mode } = action.payload;
  return {
    ...state,
    nodeNameMode: mode,
  };
});
