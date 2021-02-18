import * as React from "react";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { startSim } from "@/actions/sim-start";
import { stopSim } from "@/actions/sim-stop";
import { pauseSim } from "@/actions/sim-pause";
import { useAction } from "@/hooks/useAction";

import {
  isSimActiveSelector,
  isSimPausedSelector,
} from "@/services/simulator-control/selectors/run";
import { averageMsecsPerTickSelector } from "@/services/simulator/selectors/performance";

import PlayIcon from "../Icons/Play";
import StopIcon from "../Icons/Stop";
import PauseIcon from "../Icons/Pause";

import styles from "./SimControls.module.css";

const PlayPauseButton: React.FC = () => {
  const isActive = useSelector(isSimActiveSelector);
  const isPaused = useSelector(isSimPausedSelector);

  const avgMsecsPerTick = useSelector(averageMsecsPerTickSelector);

  const onPlayClick = useAction(startSim);
  const onStopClick = useAction(stopSim);
  const onPauseClick = useAction(pauseSim, "toggle");

  return (
    <span>
      {isActive && (
        <span className={styles["simrate"]}>
          {avgMsecsPerTick.toFixed(2)} ms
        </span>
      )}
      {isActive ? (
        <StopIcon
          className={cls(styles["button"], styles["button-stop"])}
          onClick={onStopClick}
        />
      ) : (
        <PlayIcon
          className={cls(styles["button"], styles["button-play"])}
          onClick={onPlayClick}
        />
      )}
      <PauseIcon
        className={cls(
          styles["button"],
          styles["button-pause"],
          !isActive && styles["button--disabled"],
          isPaused && styles["selected"]
        )}
        onClick={onPauseClick}
      />
    </span>
  );
};

export default PlayPauseButton;
