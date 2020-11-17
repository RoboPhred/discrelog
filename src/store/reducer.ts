import circuitEditorUiReducer from "@/services/circuit-editor-ui/reducer";
import circuitGraphReducer from "@/services/circuit-graph/reducer";
import circuitLayoutReducer from "@/services/circuit-layout/reducer";
import clipboardReducer from "@/services/clipboard/reducer";
import dialogReducer from "@/services/dialog/reducer";
import savedataReducer from "@/services/savedata/reducer";
import selectionReducer from "@/services/selection/reducer";
import simulatorReducer from "@/services/simulator/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { concatReducers, finalizeReducerList } from "./utils";

const reducer = finalizeReducerList(
  concatReducers(
    circuitEditorUiReducer,
    circuitGraphReducer,
    circuitLayoutReducer,
    clipboardReducer,
    dialogReducer,
    savedataReducer,
    selectionReducer,
    simulatorReducer,

    circuitEditorReducer
  )
);

export default reducer;
