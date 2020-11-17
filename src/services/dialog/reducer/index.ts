import { concatReducers } from "@/store/utils";

import dialogResponseAcceptReducer from "./dialog-response-accept";
import dialogResponseCancelReducer from "./dialog-response-cancel";
import dialogShowReducer from "./dialog-show";

export default concatReducers(
  dialogResponseAcceptReducer,
  dialogResponseCancelReducer,
  dialogShowReducer
);
