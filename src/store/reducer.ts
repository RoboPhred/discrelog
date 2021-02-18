import servicesReducer from "@/services/reducer";

import { finalizeReducerList } from "./utils";

const reducer = finalizeReducerList(servicesReducer);

export default reducer;
