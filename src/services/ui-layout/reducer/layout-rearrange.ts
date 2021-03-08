import { isRearrangeLayoutAction } from "@/actions/layout-rearrange";
import { createUiLayoutReducer } from "../utils";

export default createUiLayoutReducer((state, action) => {
  if (!isRearrangeLayoutAction(action)) {
    return state;
  }

  const { layout } = action.payload;

  return {
    ...state,
    layout,
  };
});
