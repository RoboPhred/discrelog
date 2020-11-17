import { isShowDialogAction } from "@/actions/dialog-show";
import { createDialogReducer } from "../utils";

export default createDialogReducer((state, action) => {
  if (!isShowDialogAction(action)) {
    return state;
  }

  const { dialogType, data } = action.payload;

  return {
    ...state,
    dialogType,
    data,
  };
});
