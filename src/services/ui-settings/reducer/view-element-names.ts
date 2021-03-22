import { isViewElementNamesAction } from "@/actions/view-element-names";
import { createUiSettingsReducer } from "../utils";

export default createUiSettingsReducer((state, action) => {
  if (!isViewElementNamesAction(action)) {
    return state;
  }

  const { mode } = action.payload;
  return {
    ...state,
    elementNameMode: mode,
  };
});
