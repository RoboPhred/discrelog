import { createSelector } from "reselect";

import pick from "lodash/pick";

import { elementsByElementIdSelector } from "@/services/circuit-graph/selectors/elements";

import { createSelectionSelector } from "../utils";
import { SelectionServiceState } from "../state";

export const selectedElementIdsSelector = createSelectionSelector(
  (state) => state.selectedElementIds
);

export const selectedJointIdsSelector = createSelectionSelector(
  (state) => state.selectedJointIds
);

export const isElementSelectedFromElementIdSelector = createSelectionSelector(
  (s: SelectionServiceState, elementId: string) =>
    s.selectedElementIds.indexOf(elementId) !== -1
);

export const isJointSelectedFromJointIdSelector = createSelectionSelector(
  (s: SelectionServiceState, jointId: string) =>
    s.selectedJointIds.indexOf(jointId) !== -1
);

export const selectedElementsByIdSelector = createSelector(
  elementsByElementIdSelector,
  selectedElementIdsSelector,
  (elementsById, selectedElementIds) => pick(elementsById, selectedElementIds)
);
