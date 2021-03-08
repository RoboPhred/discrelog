import { concatReducers } from "@/store/utils";

import viewNodeNamesReducer from "./view-node-names";

export default concatReducers(viewNodeNamesReducer);
