import * as React from "react";

import { cls } from "@/utils";

import { TesselValue, TesselWindowRenderer } from "./types";

import TesselFrame from "./TesselFrame";

import styles from "./Tessel.module.css";

export interface TesselProps {
  className?: string;
  rootItem: TesselValue;
  renderWindow: TesselWindowRenderer;
  onLayoutChange(rootItem: TesselValue): void;
}

const Tessel: React.FC<TesselProps> = ({
  className,
  rootItem,
  renderWindow,
  onLayoutChange,
}) => {
  return (
    <div className={cls("tessel", styles["tessel"], className)}>
      <TesselFrame
        value={rootItem}
        renderWindow={renderWindow}
        onLayoutChange={onLayoutChange}
      />
    </div>
  );
};

export default Tessel;
