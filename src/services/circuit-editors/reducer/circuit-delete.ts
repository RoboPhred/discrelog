import pick from "lodash/pick";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { createCircuitEditorsReducer } from "../utils";

export default createCircuitEditorsReducer((state, action) => {
  if (!isDeleteCircuitAction(action)) {
    return state;
  }

  const { circuitId } = action.payload;

  const keepIds = Object.keys(state.circucitEditorsById).filter(
    (id) => state.circucitEditorsById[id].circuitId === circuitId
  );

  let activeEditorId = state.activeEditorId;
  if (!activeEditorId || keepIds.indexOf(activeEditorId) === -1) {
    activeEditorId = null;
  }

  return {
    ...state,
    circucitEditorsById: pick(state.circucitEditorsById, keepIds),
    activeEditorId,
  };
});
