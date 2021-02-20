import * as React from "react";
import TesselSplitFrame from "./TesselSplitFrame";

import {
  isTesselSplit,
  isTesselWindow,
  normalizeTesselItem,
  TesselValue,
  TesselWindowRenderer,
} from "./types";

export interface TesselFrameProps {
  value: TesselValue;
  renderWindow: TesselWindowRenderer;
  onLayoutChange(value: TesselValue): void;
}

const TesselFrame: React.FC<TesselFrameProps> = ({
  value,
  renderWindow,
  onLayoutChange,
}) => {
  const item = normalizeTesselItem(value);
  if (isTesselWindow(item)) {
    return renderWindow(item);
  } else if (isTesselSplit(item)) {
    return (
      <TesselSplitFrame
        item={item}
        renderWindow={renderWindow}
        onLayoutChange={onLayoutChange}
      />
    );
  } else {
    return null;
  }
};

export default TesselFrame;
