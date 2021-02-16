import * as React from "react";
import { AnyAction, Dispatch } from "redux";

import { Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

import { alignSelectionToGrid } from "@/actions/selection-align-to-grid";
import { selectionDelete } from "@/actions/selection-delete";

export interface FioeldContextMenuProps {
  /**
   * The redux dispatcher.
   * This component is intended for use in a blueprint context menu, which
   * does not play nice with react contexts.
   */
  dispatch: Dispatch<AnyAction>;
}

const FieldContextMenu: React.FC<FioeldContextMenuProps> = ({ dispatch }) => {
  const onAlignToGrid = React.useCallback(() => {
    dispatch(alignSelectionToGrid());
  }, [dispatch]);
  const onDelete = React.useCallback(() => {
    dispatch(selectionDelete());
  }, [dispatch]);
  return (
    <Menu>
      <MenuItem text="Align Selection To Grid" onClick={onAlignToGrid} />
      <MenuDivider />
      <MenuItem text="Delete Selected" onClick={onDelete} />
    </Menu>
  );
};

export default FieldContextMenu;
