import { isWireSegmentDeleteAction } from "@/actions/wire-segment-delete";

import { createCircuitGraphReducer } from "../utils";

import wireSegmentDelete from "./operations/wire-segment-delete";

export default createCircuitGraphReducer((state, action) => {
  if (!isWireSegmentDeleteAction(action)) {
    return state;
  }

  const { segmentIds } = action.payload;

  state = segmentIds.reduce(
    (state, segmentId) => wireSegmentDelete(state, segmentId),
    state
  );

  return state;
});
