import circuitEditorUiReducer from "@/services/circuit-editor-ui/reducer";
import circuitsReducer from "@/services/circuits/reducer";
import clipboardReducer from "@/services/clipboard/reducer";
import dialogReducer from "@/services/dialog/reducer";
import nodeGraphReducer from "@/services/node-graph/reducer";
import nodeLayoutReducer from "@/services/node-layout/reducer";
import savedataReducer from "@/services/savedata/reducer";
import selectionReducer from "@/services/selection/reducer";
import simulatorReducer from "@/services/simulator/reducer";
import simulatorGraphReducer from "@/services/simulator-graph/reducer";

import { concatReducers, finalizeReducerList } from "./utils";

const reducer = finalizeReducerList(
  concatReducers(
    circuitEditorUiReducer,
    circuitsReducer,
    clipboardReducer,
    dialogReducer,
    nodeGraphReducer,
    nodeLayoutReducer,
    savedataReducer,
    selectionReducer,
    simulatorReducer,
    simulatorGraphReducer
  )
);

export default reducer;
