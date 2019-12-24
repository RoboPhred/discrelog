import clipboardReducer from "@/services/clipboard/reducer";
import simulatorReducer from "@/services/simulator/reducer";
import fieldReducer from "@/services/field/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { reduceReducers } from "./utils";

const reducer = reduceReducers(
  clipboardReducer,
  fieldReducer,
  simulatorReducer,

  circuitEditorReducer
);

export default reducer;
