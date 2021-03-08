import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";

import { rearrangeLayout } from "@/actions/layout-rearrange";

import useSelector from "@/hooks/useSelector";

import Tessel, { TesselValue, TesselWindowItem } from "@/components/Tessel";

import { layoutSelector } from "@/services/ui-layout/selectors/layout";

import CircuitFieldWindow from "./windows/CircuitFieldWindow";
import CircuitsTreeWindow from "./windows/CircuitsTreeWindow";
import NodeTrayWindow from "./windows/NodeTrayWindow";

const WindowsById: Record<string, React.ComponentType> = {
  "node-tray": NodeTrayWindow,
  "circuit-field": CircuitFieldWindow,
  "circuits-list": CircuitsTreeWindow,
};

function renderWindow(window: TesselWindowItem): React.ReactElement | null {
  const Component = WindowsById[window.windowId];
  if (!Component) {
    return null;
  }
  return <Component {...window.windowProps} />;
}

const CircuitEditorPage: React.FC = () => {
  const dispatch = useDispatch();
  const layout = useSelector(layoutSelector);
  const onLayoutChange = React.useCallback(
    (layout: TesselValue) => {
      dispatch(rearrangeLayout(layout));
    },
    [dispatch]
  );

  return (
    <Tessel
      className={cls("circuit-editor", sizing["fill-parent"])}
      rootItem={layout}
      onLayoutChange={onLayoutChange}
      renderWindow={renderWindow}
    />
  );
};

export default CircuitEditorPage;
