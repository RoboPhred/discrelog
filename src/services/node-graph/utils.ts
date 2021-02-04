import { AppState } from "@/store";

import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createNodeGraphReducer = createServiceReducerCreator("nodeGraph");
export const createNodeGraphSelector = createServiceSelectorCreator(
  "nodeGraph"
);
