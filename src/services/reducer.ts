import { concatReducers } from "@/store/utils";

import circuitEditorUiDragReducer from "./circuit-editor-drag/reducer";
import circuitEditorsReducer from "./circuit-editors/reducer";
import circuitsReducer from "./circuits/reducer";
import clipboardReducer from "./clipboard/reducer";
import dialogReducer from "./dialog/reducer";
import circuitGraphReducer from "./circuit-graph/reducer";
import circuitLayoutReducer from "./circuit-layout/reducer";
import projectReducer from "./project/reducer";
import selectionReducer from "./selection/reducer";
import simulatorReducer from "./simulator/reducer";
import simulatorControlReducer from "./simulator-control/reducers";
import tutorialReducer from "./tutorial/reducer";
import uiLayoutReducer from "./ui-layout/reducer";
import uiSettingsReducer from "./ui-settings/reducer";

const reducer = concatReducers(
  circuitEditorUiDragReducer,
  circuitEditorsReducer,
  circuitsReducer,
  clipboardReducer,
  dialogReducer,
  circuitGraphReducer,
  circuitLayoutReducer,
  projectReducer,
  selectionReducer,
  simulatorReducer,
  simulatorControlReducer,
  tutorialReducer,
  uiLayoutReducer,
  uiSettingsReducer
);

export default reducer;
