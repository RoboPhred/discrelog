import { isViewZoomAction } from "@/actions/view-zoom";
import { createCircuitEditorUiReducer } from "../utils";

const SCALE_FACTOR = 1.03;

export default createCircuitEditorUiReducer((state, action) => {
  if (!isViewZoomAction(action)) {
    return state;
  }

  const { viewScale: scale } = state;
  const { delta } = action.payload;

  return {
    ...state,
    viewScale:
      delta > 0
        ? scale * delta * SCALE_FACTOR
        : scale / (-delta * SCALE_FACTOR),
  };
});
