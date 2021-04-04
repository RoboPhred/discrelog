import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createSnapshotsReducer = createServiceReducerCreator("snapshots");
export const createSnapshotsSelector = createServiceSelectorCreator(
  "snapshots"
);
