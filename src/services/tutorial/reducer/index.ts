import { concatReducers } from "@/store/utils";

import tutorialAnnotateReducer from "./tutorial-annotate";
import tutorialDismissReducer from "./tutorial-dismiss";
import tutorialStartReducer from "./tutorial-start";

export default concatReducers(
  tutorialAnnotateReducer,
  tutorialDismissReducer,
  tutorialStartReducer
);
