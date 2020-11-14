import { ACTION_SELECT_REGION } from "@/actions/select-region";
import { ACTION_SELECT_NODES } from "@/actions/select-nodes";
import { ACTION_SELECT_CLEAR } from "@/actions/select-clear";

import { createFieldReducer } from "./utils";

const SELECTED_NODE_CHANGE_ACTIONS = [
  ACTION_SELECT_REGION,
  ACTION_SELECT_NODES,
  ACTION_SELECT_CLEAR,
];
export default createFieldReducer((state, action) => {
  if (SELECTED_NODE_CHANGE_ACTIONS.indexOf(action.type) === -1) {
    return state;
  }

  return {
    ...state,
    selectedPin: null,
  };
});
