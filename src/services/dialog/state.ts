import { SaveCircuit } from "../savedata/types";

// FIXME: There has got to be a better way of typing these, so api and selectors are type safe.

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

export interface ImportProjectCircuitsDialogData {
  circuits: SaveCircuit[];
}
export interface ImportProjectCircuitsDialogServiceState
  extends DialogServiceBaseState {
  dialogType: "import-project-circuits";
  data: ImportProjectCircuitsDialogData;
}

export type DialogServiceState =
  | EmptyDialogServiceState
  | ExportProjectLinkDialogServiceState
  | ImportProjectCircuitsDialogServiceState;
export type DialogType = DialogServiceState["dialogType"];

const _defaultState: EmptyDialogServiceState = {
  dialogType: null,
  data: null,
};

export const defaultDialogServiceState: Readonly<EmptyDialogServiceState> = Object.freeze(
  _defaultState
);
