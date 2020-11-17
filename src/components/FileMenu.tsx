import * as React from "react";
import { Menu } from "@blueprintjs/core";

import { useAction } from "@/hooks/useAction";
import { newProject } from "@/actions/project-new";
import { saveProject } from "@/actions/project-save";
import { loadProject } from "@/actions/project-load";

const FileMenu: React.FC = () => {
  const onNewProject = useAction(newProject);
  const onSaveProject = useAction(saveProject);
  const onLoadProject = useAction(loadProject);

  return (
    <Menu>
      <Menu.Item onClick={onNewProject} icon="new-object" text="New" />
      <Menu.Divider />
      <Menu.Item onClick={onLoadProject} icon="document-open" text="Load" />
      <Menu.Item onClick={onSaveProject} icon="saved" text="Save" />
    </Menu>
  );
};

export default FileMenu;
