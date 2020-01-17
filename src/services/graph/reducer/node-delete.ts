import pick from "lodash/pick";
import difference from "lodash/difference";
import { AnyAction } from "redux";
import pickBy from "lodash/pickBy";

import { AppState, defaultAppState } from "@/store";
import rootReducer from "@/store/reducer";

import { isDeleteNodeAction } from "@/actions/node-delete";
import { detatchWire } from "@/actions/wire-detatch";

import { Connection } from "../types";
import { fpSet } from "@/utils";

export default (state: AppState = defaultAppState, action: AnyAction) => {
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

  // We need to ensure wires detatch cleanly, so we can remove joints.
  //  If we could cleanly order reducers, we could let other
  //  reducers handle ACTION_NODE_DELETE before we do,
  //  as they need the wiresById data still intact to know
  //  if their wireIds are affected.
  // TODO: Do not call rootReducer here; order reducers
  //  so that node-remove reducers for field run before us.
  const wiresToRemove = Object.keys(state.services.graph.wiresById).filter(
    wireId => !isRemainingConnection(state.services.graph.wiresById[wireId])
  );
  state = wiresToRemove.reduce(
    (appState, wireId) => rootReducer(appState, detatchWire(wireId)),
    state
  );

  state = fpSet(state, "services", "graph", {
    ...state.services.graph,
    nodesById: pick(state.services.graph.nodesById, remainingNodeIds),
    wiresById: pickBy(state.services.graph.wiresById, isRemainingConnection)
  });

  return state;
};
