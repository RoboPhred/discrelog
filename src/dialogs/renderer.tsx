import React from "react";
import { DialogType } from "./types";

import { ExportProjectLinkDialog } from "./dialog-types/export-project-link";
import { ImportProjectCircuitsDialog } from "./dialog-types/import-project-circuits";

export function getDialogComponent(type: DialogType): React.ComponentType {
  switch (type) {
    case "export-project-link":
      return ExportProjectLinkDialog;
    case "import-project-circuits":
      return ImportProjectCircuitsDialog;
    default:
      return unknownDialog(type);
  }
}

function unknownDialog(dialogType: never): never {
  throw new Error(`Unknown dialog type ${dialogType}`);
}
