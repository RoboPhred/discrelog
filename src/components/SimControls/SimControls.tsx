import * as React from "react";
import { useDispatch } from "react-redux";

import { cls } from "@/utils";

import useSelector from "@/hooks/useSelector";

import {
  isSimActiveSelector,
  isSimPausedSelector
} from "@/services/simulator/selectors/run";

import { startSim } from "@/actions/sim-start";
import { stopSim } from "@/actions/sim-stop";
import { pauseSim } from "@/actions/sim-pause";

import PlayIcon from "../Icons/Play";

import styles from "./SimControls.module.css";
import StopIcon from "../Icons/Stop";
import PauseIcon from "../Icons/Pause";

const PlayPauseButton: React.FC = () => {
  const dispatch = useDispatch();
  const isActive = useSelector(isSimActiveSelector);
  const isPaused = useSelector(isSimPausedSelector);

  const onPlayClick = React.useCallback(() => {
    dispatch(startSim());
  }, []);

  const onStopClick = React.useCallback(() => {
    dispatch(stopSim());
  }, []);

  const onPauseClick = React.useCallback(() => {
    if (isActive) {
      dispatch(pauseSim("toggle"));
    }
  }, [isActive]);

  return (
    <span>
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
