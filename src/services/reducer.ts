import { concatReducers } from "@/store/utils";

import circuitEditorUiDragReducer from "./circuit-editor-ui-drag/reducer";
import circuitEditorsReducer from "./circuit-editors/reducer";
import circuitsReducer from "./circuits/reducer";
import clipboardReducer from "./clipboard/reducer";
import dialogReducer from "./dialog/reducer";
import nodeGraphReducer from "./node-graph/reducer";
import nodeLayoutReducer from "./node-layout/reducer";
import projectReducer from "./project/reducer";
import selectionReducer from "./selection/reducer";
import simulatorReducer from "./simulator/reducer";
import simulatorControlReducer from "./simulator-control/reducers";
import uiLayoutReducer from "./ui-layout/reducer";
import uiSettingsReducer from "./ui-settings/reducer";

const reducer = concatReducers(
  circuitEditorUiDragReducer,
  circuitEditorsReducer,
  circuitsReducer,
  clipboardReducer,
  dialogReducer,
  nodeGraphReducer,
  nodeLayoutReducer,
  projectReducer,
  selectionReducer,
  simulatorReducer,
  simulatorControlReducer,
  uiLayoutReducer,
  uiSettingsReducer
);

export default reducer;
