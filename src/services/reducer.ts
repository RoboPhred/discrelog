import { concatReducers } from "@/store/utils";

import circuitEditorUiReducer from "./circuit-editor-ui/reducer";
import circuitEditorViewReducer from "./circuit-editor-view/reducer";
import circuitsReducer from "./circuits/reducer";
import clipboardReducer from "./clipboard/reducer";
import dialogReducer from "./dialog/reducer";
import nodeGraphReducer from "./node-graph/reducer";
import nodeLayoutReducer from "./node-layout/reducer";
import savedataReducer from "./savedata/reducer";
import selectionReducer from "./selection/reducer";
import simulatorReducer from "./simulator/reducer";
import simulatorGraphReducer from "./simulator-graph/reducer";

const reducer = concatReducers(
  circuitEditorUiReducer,
  circuitEditorViewReducer,
  circuitsReducer,
  clipboardReducer,
  dialogReducer,
  nodeGraphReducer,
  nodeLayoutReducer,
  savedataReducer,
  selectionReducer,
  simulatorReducer,
  simulatorGraphReducer
);

export default reducer;
