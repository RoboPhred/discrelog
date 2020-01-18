import { concatReducers } from "@/store/utils";

import clipboardCopyReducer from "./clipboard-copy";
import clipboardPasteReducer from "./clipboard-paste";

const clipboardReducer = concatReducers(
  clipboardCopyReducer,
  clipboardPasteReducer
);

export default clipboardReducer;
