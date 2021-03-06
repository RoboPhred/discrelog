import * as React from "react";
import { useDispatch } from "react-redux";

import MenuItem from "@/components/Menus/MenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";

import { selectionAlignToGrid } from "@/actions/selection-align-to-grid";
import { deleteSelection } from "@/actions/selection-delete";

const ContextMenuItems: React.FC = () => {
  const dispatch = useDispatch();

  const onAlignToGrid = React.useCallback(() => {
    dispatch(selectionAlignToGrid());
  }, [dispatch]);
  const onDelete = React.useCallback(() => {
    dispatch(deleteSelection());
  }, [dispatch]);
  return (
    <>
      <MenuItem onClick={onAlignToGrid}>Align Selection To Grid</MenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onDelete}>Delete Selected</MenuItem>
    </>
  );
};

export default ContextMenuItems;
