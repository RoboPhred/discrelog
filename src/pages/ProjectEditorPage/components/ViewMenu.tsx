import * as React from "react";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { viewNodeNames } from "@/actions/view-node-names";
import { resetView } from "@/actions/view-reset";

import { nodeNameModeSelector } from "@/services/ui-settings/selectors/node-name";

import Menu from "@/components/Menus/Menu";
import CheckboxMenuItemItem from "@/components/Menus/CheckboxMenuItem";
import SubMenuItem from "@/components/Menus/SubMenuItem";
import DividerMenuItem from "@/components/Menus/DividerMenuItem";
import MenuItem from "@/components/Menus/MenuItem";

const ViewMenu: React.FC = () => {
  const onResetView = useAction(resetView);
  return (
    <Menu>
      <SubMenuItem content={<ElementNamesMenu />}>Element Names</SubMenuItem>
      <DividerMenuItem />
      <MenuItem onClick={onResetView}>Reset View</MenuItem>
    </Menu>
  );
};

const ElementNamesMenu: React.FC = () => {
  const mode = useSelector(nodeNameModeSelector);
  const onAlwaysVisible = useAction(viewNodeNames, "all");
  const onNamedOnly = useAction(viewNodeNames, "named-only");
  const onHidden = useAction(viewNodeNames, "none");

  return (
    <Menu>
      <CheckboxMenuItemItem value={mode === "all"} onChange={onAlwaysVisible}>
        Always visible
      </CheckboxMenuItemItem>
      <CheckboxMenuItemItem
        value={mode === "named-only"}
        onChange={onNamedOnly}
      >
        Named Items Only
      </CheckboxMenuItemItem>
      <CheckboxMenuItemItem value={mode === "none"} onChange={onHidden}>
        Hidden
      </CheckboxMenuItemItem>
    </Menu>
  );
};

export default ViewMenu;
