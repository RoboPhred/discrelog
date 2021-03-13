import * as React from "react";

import { useAction } from "@/hooks/useAction";
import { newProject } from "@/actions/project-new";
import { saveProject } from "@/actions/project-save";
import { loadProject } from "@/actions/project-load";
import { exportProjectLink } from "@/actions/project-export-link";

import Menu from "./Menus/Menu";
import MenuItem from "./Menus/MenuItem";
import DividerMenuItem from "./Menus/DividerMenuItem";
import { importCircuitFromProject } from "@/actions/project-import-circuits";

const FileMenu: React.FC = () => {
  const onNewProject = useAction(newProject);
  const onSaveProject = useAction(saveProject);
  const onLoadProject = useAction(loadProject);
  const onImportProjectCircuits = useAction(importCircuitFromProject);
  const onExportLink = useAction(exportProjectLink);

  return (
    <Menu>
      <MenuItem onClick={onNewProject}>New</MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onLoadProject}>Load</MenuItem>
      <MenuItem onClick={onSaveProject}>Save</MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onImportProjectCircuits}>Import Circuits</MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onExportLink}>Export Link</MenuItem>
    </Menu>
  );
};

export default FileMenu;
