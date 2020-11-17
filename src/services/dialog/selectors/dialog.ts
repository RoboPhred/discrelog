import { createDialogSelector } from "../utils";

export const dialogTypeSelector = createDialogSelector((s) => s.dialogType);
export const dialogDataSelector = createDialogSelector((s) => s.data);
