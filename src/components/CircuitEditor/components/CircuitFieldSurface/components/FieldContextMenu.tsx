import * as React from "react";

import { Point } from "@/geometry";

import Menu from "@/components/Menus/Menu";

import ContextMenuItems from "./ContextMenuItems";

export interface FieldContextMenuProps {
  fieldPosition: Point;
}
const FieldContextMenu: React.FC<FieldContextMenuProps> = ({
  fieldPosition,
}) => {
  return (
    <Menu>
      <ContextMenuItems fieldPosition={fieldPosition} />
    </Menu>
  );
};

export default FieldContextMenu;
