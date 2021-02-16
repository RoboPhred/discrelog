import * as React from "React";
import { AnyAction, Dispatch } from "redux";

import { Menu, MenuItem } from "@blueprintjs/core";

import { alignSelectionToGrid } from "@/actions/selection-align-to-grid";

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
  return (
    <Menu>
      <MenuItem text="Align Selection To Grid" onClick={onAlignToGrid} />
    </Menu>
  );
};

export default FieldContextMenu;
