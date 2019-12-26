import clipboardReducer from "@/services/clipboard/reducer";
import fieldReducer from "@/services/field/reducer";
import graphReducer from "@/services/graph/reducer";
import selectionReducer from "@/services/selection/reducer";
import simulatorReducer from "@/services/simulator/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { reduceReducers } from "./utils";

const reducer = reduceReducers(
  // This reducer should run before the others.
  //  Particularly simulatorReducer, which requires the graph to have been
  //  updated before it
  graphReducer,

  clipboardReducer,
  fieldReducer,
  selectionReducer,
  simulatorReducer,

  circuitEditorReducer
);

export default reducer;
