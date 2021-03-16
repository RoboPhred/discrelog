import * as React from "react";

import Menu from "@/components/Menus/Menu";

import ContextMenuItems from "./ContextMenuItems";

const FieldContextMenu: React.FC = () => {
  return (
    <Menu>
      <ContextMenuItems />
    </Menu>
  );
};

export default FieldContextMenu;
