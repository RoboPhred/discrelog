import clipboardReducer from "@/services/clipboard/reducer";
import fieldReducer from "@/services/field/reducer";
import selectionReducer from "@/services/selection/reducer";
import simulatorReducer from "@/services/simulator/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { reduceReducers } from "./utils";

const reducer = reduceReducers(
  clipboardReducer,
  fieldReducer,
  selectionReducer,
  simulatorReducer,

  circuitEditorReducer
);

export default reducer;
