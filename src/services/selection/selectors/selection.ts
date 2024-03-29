import { createSelector } from "reselect";

import pick from "lodash/pick";

import { elementsByElementIdSelector } from "@/services/circuit-graph/selectors/elements";

import { createSelectionSelector } from "../utils";
import { SelectionServiceState } from "../state";

export const selectedElementIdsSelector = createSelectionSelector(
  (state) => state.selectedElementIds
);

export const selectedJointIdsSelector = createSelectionSelector(
  (state) => state.selectedWireJointIds
);

export const isElementSelectedFromElementIdSelector = createSelectionSelector(
  (s: SelectionServiceState, elementId: string) =>
    s.selectedElementIds.indexOf(elementId) !== -1
);

export const isJointSelectedFromJointIdSelector = createSelectionSelector(
  (s: SelectionServiceState, jointId: string) =>
    s.selectedWireJointIds.indexOf(jointId) !== -1
);

export const isSegmentSelectedFromSegmentIdSelector = createSelectionSelector(
  (s: SelectionServiceState, wireSegmentId: string) =>
    s.selectedWireSegmentIds.indexOf(wireSegmentId) !== -1
);

export const selectedElementsByIdSelector = createSelector(
  elementsByElementIdSelector,
  selectedElementIdsSelector,
  (elementsById, selectedElementIds) => pick(elementsById, selectedElementIds)
);
