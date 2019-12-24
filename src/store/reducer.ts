import simulatorReducer from "@/services/simulator/reducer";
import fieldReducer from "@/services/field/reducer";

import circuitEditorReducer from "@/pages/CircuitEditor/reducer";

import { reduceReducers } from "./utils";

const reducer = reduceReducers(
  fieldReducer,
  simulatorReducer,

  circuitEditorReducer
);

export default reducer;
