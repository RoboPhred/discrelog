import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { createGraphReducer } from "../utils";
import { Connection } from "../types";

export default createGraphReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  const remainingIds = difference(Object.keys(state.nodesById), nodeIds);

  function isRemainingConnection(c: Connection) {
    return (
      remainingIds.indexOf(c.inputPin.nodeId) !== -1 &&
      remainingIds.indexOf(c.outputPin.nodeId) !== -1
    );
  }

  return {
    ...state,
    nodesById: pick(state.nodesById, remainingIds),
    wiresById: pickBy(state.wiresById, isRemainingConnection)
  };
});
