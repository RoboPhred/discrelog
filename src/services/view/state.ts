export interface ViewState {
  scale: number;
}

const _defaultState: ViewState = {
  scale: 1
};

export const defaultViewState = Object.freeze(_defaultState);
