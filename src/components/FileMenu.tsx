import * as React from "react";
import { Menu } from "@blueprintjs/core";

import { useAction } from "@/hooks/useAction";
import { newFile } from "@/actions/file-new";

const FileMenu: React.FC = () => {
  const onFileNew = useAction(newFile);

  return (
    <Menu>
      <Menu.Item onClick={onFileNew} icon="new-object" text="New" />
    </Menu>
  );
};

export default FileMenu;
