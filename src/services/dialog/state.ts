// FIXME: There has got to be a better way of typing these, so api and selectors are type safe.

import { DialogType } from "@/dialogs/types";

export interface DialogServiceState {
  dialogType: DialogType | null;
  data: any;
}

const _defaultState: DialogServiceState = {
  dialogType: null,
  data: null,
};

export const defaultDialogServiceState: Readonly<DialogServiceState> = Object.freeze(
  _defaultState
);
