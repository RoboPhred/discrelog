import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { dialogTypeSelector } from "@/services/dialog/selectors/dialog";

import CreateCircuitDialog from "./dialogs/CreateCircuitDialog";
import SaveProjectDialog from "./dialogs/SaveProjectDialog";

const DialogManager: React.FC = () => {
  const dialogType = useSelector(dialogTypeSelector);

  switch (dialogType) {
    case "save-project":
      return <SaveProjectDialog />;
    case "create-circuit":
      return <CreateCircuitDialog />;
    default:
      return null;
  }
};

export default DialogManager;
