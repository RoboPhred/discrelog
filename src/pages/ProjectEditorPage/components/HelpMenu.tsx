import * as React from "react";

import { useAction } from "@/hooks/useAction";

import { tutorialStart } from "@/actions/tutorial-start";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import SubMenuItem from "@/components/Menus/SubMenuItem";

const HelpMenu: React.FC = () => {
  return (
    <Menu>
      <SubMenuItem content={<TutorialsMenu />}>Tutorials</SubMenuItem>
    </Menu>
  );
};

const TutorialsMenu: React.FC = () => {
  const onBasicsTutorial = useAction(tutorialStart, "basics");
  const onCircuitsTutorial = useAction(tutorialStart, "circuits");
  return (
    <Menu>
      <MenuItem onClick={onBasicsTutorial}>Basics</MenuItem>
      <MenuItem onClick={onCircuitsTutorial}>Circuits</MenuItem>
    </Menu>
  );
};

export default HelpMenu;
