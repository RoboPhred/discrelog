import difference from "lodash/difference";
import pick from "lodash/pick";

import { priorityBefore, reducerPriority } from "@/store/priorities";

import { isDeleteElementAction } from "@/actions/element-delete";

import circuitGraphElementDeleteReducer from "@/services/circuit-graph/reducer/element-delete";

import { createCircuitLayoutReducer } from "../utils";

// We need to run this reducer before graph runs, as we want to check what connections are on the element being deleted.
export default reducerPriority(
  priorityBefore(circuitGraphElementDeleteReducer),
  createCircuitLayoutReducer((state, action) => {
    if (!isDeleteElementAction(action)) {
      return state;
    }

    const { elementIds } = action.payload;

    const remainingElementIds = difference(
      Object.keys(state.elementPositionsById),
      elementIds
    );

    return {
      ...state,
      elementPositionsById: pick(
        state.elementPositionsById,
        remainingElementIds
      ),
    };
  })
);
