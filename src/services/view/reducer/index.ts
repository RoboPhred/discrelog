import { concatReducers } from "@/store/utils";

import viewZoomReducer from "./view-zoom";

export default concatReducers(viewZoomReducer);
