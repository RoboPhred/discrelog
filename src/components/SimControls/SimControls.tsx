import * as React from "react";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import { startSim } from "@/actions/sim-start";
import { stopSim } from "@/actions/sim-stop";
import { pauseSim } from "@/actions/sim-pause";
import { useClickAction } from "@/hooks/useAction";
import { stepSim } from "@/actions/sim-step";

import {
  isSimActiveSelector,
  isSimPausedSelector,
} from "@/services/simulator-control/selectors/run";
import { averageMsecsPerTickSelector } from "@/services/simulator/selectors/performance";

import PlayIcon from "../Icons/Play";
import StopIcon from "../Icons/Stop";
import PauseIcon from "../Icons/Pause";
import StepIcon from "../Icons/Step";

import styles from "./SimControls.module.css";

const PlayPauseButton: React.FC = () => {
  const isActive = useSelector(isSimActiveSelector);
  const isPaused = useSelector(isSimPausedSelector);

  const avgMsecsPerTick = useSelector(averageMsecsPerTickSelector);

  const onPlayClick = useClickAction(startSim);
  const onStopClick = useClickAction(stopSim);
  const onPauseClick = useClickAction(pauseSim, "toggle");
  const onStepClick = useClickAction(stepSim);

  const onMuteMouseDown = React.useCallback((e: React.MouseEvent) => {
    // Prevent rapid clicks from selecting nearby text.
    e.preventDefault();
  }, []);

  return (
    <span>
      {isActive && (
        <span className={styles["simrate"]}>
          {avgMsecsPerTick.toFixed(2)} ms
        </span>
      )}
      {isActive ? (
        <StopIcon
          id="simctrl-stop"
          className={cls(styles["button"], styles["button-stop"])}
          onClick={onStopClick}
          onMouseDown={onMuteMouseDown}
        />
      ) : (
        <PlayIcon
          id="simctrl-run"
          className={cls(styles["button"], styles["button-play"])}
          onClick={onPlayClick}
          onMouseDown={onMuteMouseDown}
        />
      )}
      <StepIcon
        id="simctrl-step"
        className={cls(styles["button"], styles["button-step"])}
        onClick={onStepClick}
        onMouseDown={onMuteMouseDown}
      />
      <PauseIcon
        id="simctrl-pause"
        className={cls(
          styles["button"],
          styles["button-pause"],
          !isActive && styles["button--disabled"],
          isPaused && styles["selected"]
        )}
        onClick={onPauseClick}
        onMouseDown={onMuteMouseDown}
      />
    </span>
  );
};

export default PlayPauseButton;
