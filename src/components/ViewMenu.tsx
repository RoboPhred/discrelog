import * as React from "react";

import { useAction } from "@/hooks/useAction";
import useSelector from "@/hooks/useSelector";

import { viewNodeNames } from "@/actions/view-node-names";

import { nodeNameModeSelector } from "@/services/ui-settings/selectors/node-name";

import Menu from "./Menus/Menu";
import CheckboxMenuItemItem from "./Menus/CheckboxMenuItem";
import SubMenuItem from "./Menus/SubMenuItem";

const ViewMenu: React.FC = () => {
  return (
    <Menu>
      <SubMenuItem content={<ElementNamesMenu />}>Element Names</SubMenuItem>
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
