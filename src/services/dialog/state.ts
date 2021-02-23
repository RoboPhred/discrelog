export interface DialogServiceBaseState {
  dialogType: string | null;
  data: any;
}

export interface EmptyDialogServiceState extends DialogServiceBaseState {
  dialogType: null;
  data: null;
}

export interface ExportProjectLinkDialogData {
  projectLink: string;
}
export interface ExportProjectLinkDialogServiceState
  extends DialogServiceBaseState {
  dialogType: "export-project-link";
  data: ExportProjectLinkDialogData;
}

export type DialogServiceState =
  | EmptyDialogServiceState
  | ExportProjectLinkDialogServiceState;
export type DialogType = DialogServiceState["dialogType"];

const _defaultState: EmptyDialogServiceState = {
  dialogType: null,
  data: null,
};

export const defaultDialogServiceState: Readonly<EmptyDialogServiceState> = Object.freeze(
  _defaultState
);
