import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { dialogTypeSelector } from "@/services/dialog/selectors/dialog";

import ExportProjectLinkDialog from "./dialogs/ExportLinkDialog";

const DialogManager: React.FC = () => {
  const dialogType = useSelector(dialogTypeSelector);

  switch (dialogType) {
    default:
      return null;
    case "export-project-link":
      return <ExportProjectLinkDialog />;
  }
};

export default DialogManager;
