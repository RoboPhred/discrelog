import { concatReducers } from "@/store/utils";

import layoutRearrangeReducer from "./layout-rearrange";

export default concatReducers(layoutRearrangeReducer);
