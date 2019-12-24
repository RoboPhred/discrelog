import {
  createServiceReducerCreator,
  createServiceSelectorCreator
} from "../service-state-utils";

export const createClipboardReducer = createServiceReducerCreator("clipboard");
export const createClipboardSelector = createServiceSelectorCreator(
  "clipboard"
);
