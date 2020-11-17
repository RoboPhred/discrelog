import * as React from "react";
import { Menu } from "@blueprintjs/core";

import { useAction } from "@/hooks/useAction";
import { newFile } from "@/actions/file-new";
import { saveProject } from "@/actions/project-save";
import { loadProject } from "@/actions/project-load";

const FileMenu: React.FC = () => {
  const onFileNew = useAction(newFile);
  const onSaveProject = useAction(saveProject);
  const onLoadProject = useAction(loadProject);

  return (
    <Menu>
      <Menu.Item onClick={onFileNew} icon="new-object" text="New" />
      <Menu.Divider />
      <Menu.Item onClick={onLoadProject} icon="document-open" text="Load" />
      <Menu.Item onClick={onSaveProject} icon="saved" text="Save" />
    </Menu>
  );
};

export default FileMenu;
