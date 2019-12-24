import { reduceReducers } from "@/store/utils";

import clipboardCopyReducer from "./clipboard-copy";
import clipboardPasteReducer from "./clipboard-paste";

const clipboardReducer = reduceReducers(
  clipboardCopyReducer,
  clipboardPasteReducer
);

export default clipboardReducer;
