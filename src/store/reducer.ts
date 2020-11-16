import clipboardReducer from "@/services/clipboard/reducer";
import fieldReducer from "@/services/field/reducer";
import graphReducer from "@/services/node-graph/reducer";
import savedataReducer from "@/services/savedata/reducer";
import selectionReducer from "@/services/selection/reducer";
import simulatorReducer from "@/services/simulator/reducer";
import viewReducer from "@/services/view/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { concatReducers, finalizeReducerList } from "./utils";

const reducer = finalizeReducerList(
  concatReducers(
    // This reducer should run before the others.
    //  Particularly simulatorReducer, which requires the graph to have been
    //  updated before it
    graphReducer,

    clipboardReducer,
    fieldReducer,
    selectionReducer,
    simulatorReducer,
    viewReducer,

    circuitEditorReducer,

    // Place this last, so it always has the most up to date data.
    savedataReducer
  )
);

export default reducer;
