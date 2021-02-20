import * as React from "react";

import useSelector from "@/hooks/useSelector";
import { dialogTypeSelector } from "@/services/dialog/selectors/dialog";

const DialogManager: React.FC = () => {
  const dialogType = useSelector(dialogTypeSelector);

  switch (dialogType) {
    default:
      return null;
  }
};

export default DialogManager;
