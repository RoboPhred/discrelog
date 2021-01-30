import { concatReducers } from "@/store/utils";

import elementAddReducer from "./element-add";
import projectNewReducer from "./project-new";

export default concatReducers(elementAddReducer, projectNewReducer);
