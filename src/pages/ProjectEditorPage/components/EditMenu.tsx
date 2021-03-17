import * as React from "react";

import { keyboardCommandModifier } from "@/runtime-env";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { canRedoSelector, canUndoSelector } from "@/undo/selectors";

import { undo } from "@/actions/undo";
import { redo } from "@/actions/redo";

import Menu from "@/components/Menus/Menu";
import MenuItem from "@/components/Menus/MenuItem";

const EditMenu: React.FC = () => {
  const canUndo = useSelector(canUndoSelector);
  const onUndo = useAction(undo);
  const canRedo = useSelector(canRedoSelector);
  const onRedo = useAction(redo);

  return (
    <Menu>
      <MenuItem
        disabled={!canUndo}
        secondary={`${keyboardCommandModifier}+z`}
        onClick={onUndo}
      >
        Undo
      </MenuItem>
      <MenuItem
        disabled={!canRedo}
        secondary={`${keyboardCommandModifier}+shift+z`}
        onClick={onRedo}
      >
        Redo
      </MenuItem>
    </Menu>
  );
};

export default EditMenu;
