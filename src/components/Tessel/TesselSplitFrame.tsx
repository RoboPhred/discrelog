import * as React from "react";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import {
  TesselItem,
  TesselSplitItem,
  TesselValue,
  TesselWindowRenderer,
} from "./types";

import TesselSplit from "./TesselSplit";
import TesselFrame from "./TesselFrame";

export interface TesselSplitFrameProps {
  item: TesselSplitItem;
  renderWindow: TesselWindowRenderer;
  onLayoutChange(relativeRoot: TesselItem): void;
}

const TesselSplitFrame: React.FC<TesselSplitFrameProps> = ({
  item,
  renderWindow,
  onLayoutChange,
}) => {
  const { direction, first, second, divisionPercent } = item;
  const sizeDirection = direction === "row" ? "width" : "height";

  const onChangePercentage = React.useCallback(
    (percentage: number) => {
      onLayoutChange({
        ...item,
        divisionPercent: percentage,
      });
    },
    [item, onLayoutChange]
  );

  const onFirstLayoutChange = React.useCallback(
    (value: TesselValue) => {
      onLayoutChange({
        ...item,
        first: value,
      });
    },
    [item, onLayoutChange]
  );

  const onSecondLayoutChange = React.useCallback(
    (value: TesselValue) => {
      onLayoutChange({
        ...item,
        second: value,
      });
    },
    [item, onLayoutChange]
  );

  return (
    <div
      className={cls(
        sizing["fill-parent"],
        flex[direction === "row" ? "flex-row" : "flex-column"]
      )}
    >
      <div style={{ [sizeDirection]: `${divisionPercent}%` }}>
        <TesselFrame
          value={first}
          renderWindow={renderWindow}
          onLayoutChange={onFirstLayoutChange}
        />
      </div>
      <TesselSplit
        direction={direction}
        onChangePercentage={onChangePercentage}
      />
      <div style={{ [sizeDirection]: `${100 - divisionPercent}%` }}>
        <TesselFrame
          value={second}
          renderWindow={renderWindow}
          onLayoutChange={onSecondLayoutChange}
        />
      </div>
    </div>
  );
};

export default TesselSplitFrame;
