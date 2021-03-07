import * as React from "react";

import { cls } from "@/utils";

import sizing from "@/styles/sizing.module.css";
import flex from "@/styles/flex.module.css";

import {
  isTesselFixedDivision,
  isTesselPercentDivision,
  normalizeTesselDivision,
  TesselDivision,
  TesselItem,
  TesselSplitItem,
  TesselValue,
  TesselWindowRenderer,
} from "./types";

import TesselSplit from "./TesselSplit";
import TesselFrame from "./TesselFrame";
import TesselPathProvider from "./TesselContext";

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
  const { direction, first, second, division: divisionValue } = item;
  const sizeDirection = direction === "row" ? "width" : "height";

  const onChangePercentage = React.useCallback(
    (percentage: number, absolute: number) => {
      const division = normalizeTesselDivision(item.division);
      onLayoutChange({
        ...item,
        division: applyDivisionChange(division, percentage, absolute),
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

  const division = normalizeTesselDivision(divisionValue);
  let firstSize = "50%";
  let secondSize = "50%";
  let firstFix = false;
  let secondFix = false;
  if (isTesselPercentDivision(division)) {
    const { firstPercent } = division;
    firstSize = `${firstPercent}%`;
    secondSize = `${100 - firstPercent}%`;
  } else if (isTesselFixedDivision(division)) {
    const { firstSize: firstSizeDiv, secondSize: secondSizeDiv } = division;
    // Only support one of firstSize or secondSize
    if (firstSizeDiv) {
      firstSize = `${firstSizeDiv}px`;
      firstFix = true;
      secondSize = "100%";
    } else {
      firstSize = "100%";
      secondSize = `${secondSizeDiv}px`;
      secondFix = true;
    }
  }

  return (
    <div
      className={cls(
        sizing["fill-parent"],
        flex[direction === "row" ? "flex-row" : "flex-column"]
      )}
    >
      <div
        className={cls(
          firstFix ? flex["flexitem-fix"] : flex["flexitem-shrink"]
        )}
        style={{ [sizeDirection]: firstSize }}
      >
        <TesselPathProvider pathKey="first">
          <TesselFrame
            value={first}
            renderWindow={renderWindow}
            onLayoutChange={onFirstLayoutChange}
          />
        </TesselPathProvider>
      </div>
      <TesselSplit
        direction={direction}
        onChangePercentage={onChangePercentage}
      />
      <div
        className={cls(
          secondFix ? flex["flexitem-fix"] : flex["flexitem-shrink"]
        )}
        style={{ [sizeDirection]: secondSize }}
      >
        <TesselPathProvider pathKey="second">
          <TesselFrame
            value={second}
            renderWindow={renderWindow}
            onLayoutChange={onSecondLayoutChange}
          />
        </TesselPathProvider>
      </div>
    </div>
  );
};

function applyDivisionChange(
  division: TesselDivision,
  percent: number,
  absolute: number
): TesselDivision {
  if (isTesselPercentDivision(division)) {
    return {
      firstPercent: percent,
    };
  } else if (isTesselFixedDivision(division)) {
    if (typeof division.secondSize === "number") {
      return {
        secondSize: absolute,
      };
    }

    return {
      firstSize: absolute,
    };
  }

  return division;
}

export default TesselSplitFrame;
