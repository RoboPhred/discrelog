import pick from "lodash/pick";
import difference from "lodash/difference";
import pickBy from "lodash/pickBy";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { Connection } from "../types";
import { createCircuitGraphReducer } from "../utils";

export default createCircuitGraphReducer((state, action) => {
  if (!isDeleteNodeAction(action)) {
    return state;
  }

  const { nodeIds } = action.payload;

  const remainingNodeIds = difference(Object.keys(state.nodesById), nodeIds);

  function isRemainingConnection(c: Connection) {
    return (
      remainingNodeIds.indexOf(c.inputPin.nodeId) !== -1 &&
      remainingNodeIds.indexOf(c.outputPin.nodeId) !== -1
    );
  }

  return {
    ...state,
    nodesById: pick(state.nodesById, remainingNodeIds),
    wiresById: pickBy(state.wiresById, isRemainingConnection),
  };
});
