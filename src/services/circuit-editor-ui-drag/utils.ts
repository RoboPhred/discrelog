import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorUiDragReducer = createServiceReducerCreator(
  "circuitEditorUiDrag"
);
export const createCircuitEditorUiDragSelector = createServiceSelectorCreator(
  "circuitEditorUiDrag"
);
