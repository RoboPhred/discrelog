export interface DialogBaseState {
  dialogType: string | null;
  data: any;
}

export interface NoDialogState extends DialogBaseState {
  dialogType: null;
  data: null;
}

export interface SaveFileDialogState extends DialogBaseState {
  dialogType: "save-project";
  data: null;
}

export type DialogState = NoDialogState | SaveFileDialogState;
export type DialogType = DialogState["dialogType"];

const _defaultState: NoDialogState = {
  dialogType: null,
  data: null,
};

export const defaultDialogState: Readonly<NoDialogState> = Object.freeze(
  _defaultState
);
