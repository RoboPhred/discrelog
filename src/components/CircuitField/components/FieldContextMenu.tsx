import * as React from "react";
import { useDispatch } from "react-redux";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";

import { selectionAlignToGrid } from "@/actions/selection-align-to-grid";
import { deleteSelection } from "@/actions/selection-delete";

const FieldContextMenu: React.FC = () => {
  const dispatch = useDispatch();

  const onAlignToGrid = React.useCallback(() => {
    dispatch(selectionAlignToGrid());
  }, [dispatch]);
  const onDelete = React.useCallback(() => {
    dispatch(deleteSelection());
  }, [dispatch]);
  return (
    <Menu>
      <MenuItem onClick={onAlignToGrid}>Align Selection To Grid</MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onDelete}>Delete Selected</MenuItem>
    </Menu>
  );
};

export default FieldContextMenu;
