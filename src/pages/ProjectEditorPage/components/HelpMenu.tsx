import * as React from "react";

import { useAction } from "@/hooks/useAction";

import { tutorialStart } from "@/actions/tutorial-start";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";

const FileMenu: React.FC = () => {
  const onBasicsTutorial = useAction(tutorialStart, "basics");

  return (
    <Menu>
      <MenuItem onClick={onBasicsTutorial}>Basic Tutorial</MenuItem>
    </Menu>
  );
};

export default FileMenu;
