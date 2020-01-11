import { isViewZoomAction } from "@/actions/view-zoom";
import { createViewReducer } from "../utils";

const SCALE_FACTOR = 1.03;

export default createViewReducer((state, action) => {
  if (!isViewZoomAction(action)) {
    return state;
  }

  const { scale } = state;
  const { delta } = action.payload;

  return {
    ...state,
    scale:
      delta > 0 ? scale * delta * SCALE_FACTOR : scale / (-delta * SCALE_FACTOR)
  };
});
