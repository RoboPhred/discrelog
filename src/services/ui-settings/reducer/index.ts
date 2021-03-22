import { concatReducers } from "@/store/utils";

import viewElementNamesReducer from "./view-element-names";

export default concatReducers(viewElementNamesReducer);
