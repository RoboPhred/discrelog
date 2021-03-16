import {
  createServiceReducerCreator,
  createServiceSelectorCreator,
} from "../service-state-utils";

export const createCircuitEditorUiDragReducer = createServiceReducerCreator(
  "circuitEditorDrag"
);
export const createCircuitEditorUiDragSelector = createServiceSelectorCreator(
  "circuitEditorDrag"
);
