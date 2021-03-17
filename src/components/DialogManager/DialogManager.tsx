import * as React from "react";

import useSelector from "@/hooks/useSelector";

import { dialogTypeSelector } from "@/services/dialog/selectors/dialog";

import { getDialogComponent } from "@/dialogs/renderer";

const DialogManager: React.FC = () => {
  const dialogType = useSelector(dialogTypeSelector);

  if (!dialogType) {
    return null;
  }

  const DialogComponent = getDialogComponent(dialogType);
  return <DialogComponent />;
};

export default DialogManager;
