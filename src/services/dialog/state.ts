export interface DialogServiceBaseState {
  dialogType: string | null;
  data: any;
}

export interface EmptyDialogServiceState extends DialogServiceBaseState {
  dialogType: null;
  data: null;
}

export interface SaveFileDialogServiceState extends DialogServiceBaseState {
  dialogType: "save-project";
  data: null;
}

export type DialogServiceState =
  | EmptyDialogServiceState
  | SaveFileDialogServiceState;
export type DialogType = DialogServiceState["dialogType"];

const _defaultState: EmptyDialogServiceState = {
  dialogType: null,
  data: null,
};

export const defaultDialogServiceState: Readonly<EmptyDialogServiceState> = Object.freeze(
  _defaultState
);
