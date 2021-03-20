import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteCircuitAction } from "@/actions/circuit-delete";

import { filterTesselValues } from "@/components/Tessel/utils";

import { isCircuitEditorTesselWindow } from "@/pages/ProjectEditorPage/windows/CircuitEditorWindow/tessel-window";

import { editorIdsFromCircuitIdSelector } from "@/services/circuit-editors/selectors/editor";
import circuitEditorsCircuitDeleteReducer from "@/services/circuit-editors/reducer/circuit-delete";

import { createUiLayoutReducer } from "../utils";

export default reducerPriority(
  priorityBefore(circuitEditorsCircuitDeleteReducer),
  createUiLayoutReducer((state, action, appState) => {
    if (!isDeleteCircuitAction(action)) {
      return state;
    }

    if (!state.layout) {
      return state;
    }

    const { circuitId } = action.payload;

    const removedWindowIds = editorIdsFromCircuitIdSelector(
      appState,
      circuitId
    );

    const layout = filterTesselValues(state.layout, (value) => {
      if (!isCircuitEditorTesselWindow(value)) {
        return true;
      }

      if (removedWindowIds.indexOf(value.windowProps.editorId) !== -1) {
        return false;
      }

      return true;
    });

    return {
      ...state,
      layout,
    };
  })
);
