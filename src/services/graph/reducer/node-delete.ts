import pick from "lodash/pick";
import difference from "lodash/difference";
import { AnyAction } from "redux";
import pickBy from "lodash/pickBy";

import { fpSet } from "@/utils";
import { AppState, defaultAppState } from "@/store";

import { reducerPriority, PRIORITY_POST } from "@/store/priorities";

import { isDeleteNodeAction } from "@/actions/node-delete";

import { Connection } from "../types";

export default reducerPriority(
  PRIORITY_POST,
  (state: AppState = defaultAppState, action: AnyAction) => {
    if (!isDeleteNodeAction(action)) {
      return state;
    }

    const { nodeIds } = action.payload;

    const remainingNodeIds = difference(
      Object.keys(state.services.graph.nodesById),
      nodeIds
    );

    function isRemainingConnection(c: Connection) {
      return (
        remainingNodeIds.indexOf(c.inputPin.nodeId) !== -1 &&
        remainingNodeIds.indexOf(c.outputPin.nodeId) !== -1
      );
    }

    state = fpSet(state, "services", "graph", value => ({
      ...value,
      nodesById: pick(state.services.graph.nodesById, remainingNodeIds),
      wiresById: pickBy(state.services.graph.wiresById, isRemainingConnection)
    }));

    return state;
  }
);
