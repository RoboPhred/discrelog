import { concatReducers } from "@/store/utils";

import circuitFieldReducer from "../components/CircuitFieldView/components/CircuitField/reducer";

export default concatReducers(circuitFieldReducer);
