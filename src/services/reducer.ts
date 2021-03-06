import { concatReducers } from "@/store/utils";

import circuitEditorUiDragReducer from "./circuit-editor-ui-drag/reducer";
import circuitEditorUiSettingsReducer from "./circuit-editor-ui-settings/reducer";
import circuitEditorUiViewportReducer from "./circuit-editor-ui-viewport/reducer";
import circuitsReducer from "./circuits/reducer";
import clipboardReducer from "./clipboard/reducer";
import dialogReducer from "./dialog/reducer";
import nodeGraphReducer from "./node-graph/reducer";
import nodeLayoutReducer from "./node-layout/reducer";
import projectReducer from "./project/reducer";
import selectionReducer from "./selection/reducer";
import simulatorReducer from "./simulator/reducer";
import simulatorControlReducer from "./simulator-control/reducers";
import simulatorGraphReducer from "./simulator-graph/reducer";

const reducer = concatReducers(
  circuitEditorUiDragReducer,
  circuitEditorUiSettingsReducer,
  circuitEditorUiViewportReducer,
  circuitsReducer,
  clipboardReducer,
  dialogReducer,
  nodeGraphReducer,
  nodeLayoutReducer,
  projectReducer,
  selectionReducer,
  simulatorReducer,
  simulatorControlReducer,
  simulatorGraphReducer
);

export default reducer;
