import { concatReducers } from "@/store/utils";

import nodeAddReducer from "./node-add";
import projectNewReducer from "./project-new";

export default concatReducers(nodeAddReducer, projectNewReducer);
