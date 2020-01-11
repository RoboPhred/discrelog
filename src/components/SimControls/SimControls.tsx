import * as React from "react";
import { useDispatch } from "react-redux";

import { startSim } from "@/actions/sim-start";
import { stopSim } from "@/actions/sim-stop";
import { isRunningSelector } from "@/services/simulator/selectors/run";

import useSelector from "@/hooks/useSelector";

import PlayIcon from "../Icons/Play";

import styles from "./SimControls.module.css";
import StopIcon from "../Icons/Stop";

const PlayPauseButton: React.FC = () => {
  const dispatch = useDispatch();
  const isRunning = useSelector(isRunningSelector);

  const onPlayClick = React.useCallback(() => {
    dispatch(startSim());
  }, []);

  const onStopClick = React.useCallback(() => {
    dispatch(stopSim());
  }, []);

  return (
    <span>
      {isRunning && (
        <StopIcon
          className={styles["simctrls-button-stop"]}
          onClick={onStopClick}
        />
      )}
      {!isRunning && (
        <PlayIcon
          className={styles["simctrls-buttom-play"]}
          onClick={onPlayClick}
        />
      )}
    </span>
  );
};

export default PlayPauseButton;
