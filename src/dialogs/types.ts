import {
  ExportProjectLinkDialogType,
  ExportProjectLinkDialogData,
  ExportProjectLinkDialogResult,
} from "./dialog-types/export-project-link";
import {
  ImportProjectCircuitsDialogType,
  ImportProjectCircuitsDialogData,
  ImportProjectCircuitsDialogResult,
} from "./dialog-types/import-project-circuits";

interface DialogDataLookup {
  [ExportProjectLinkDialogType]: ExportProjectLinkDialogData;
  [ImportProjectCircuitsDialogType]: ImportProjectCircuitsDialogData;
}

interface DialogResultLookup {
  [ExportProjectLinkDialogType]: ExportProjectLinkDialogResult;
  [ImportProjectCircuitsDialogType]: ImportProjectCircuitsDialogResult;
}

export type DialogType = keyof DialogDataLookup;

export type DialogData<T extends DialogType> = DialogDataLookup[T];
export type DialogResult<T extends DialogType> = DialogResultLookup[T];
