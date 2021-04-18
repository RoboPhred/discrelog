export interface SelectionServiceState {
  selectedElementIds: string[];
  selectedWireJointIds: string[];
  selectedWireSegmentIds: string[];
}

const _defaultState: SelectionServiceState = {
  selectedElementIds: [],
  selectedWireJointIds: [],
  selectedWireSegmentIds: [],
};

export const defaultSelectionServiceState = Object.freeze(_defaultState);
