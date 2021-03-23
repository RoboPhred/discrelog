export interface SelectionServiceState {
  selectedElementIds: string[];
}

const _defaultState: SelectionServiceState = {
  selectedElementIds: [],
};

export const defaultSelectionServiceState = Object.freeze(_defaultState);
