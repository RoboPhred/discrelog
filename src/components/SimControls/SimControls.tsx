import * as React from "react";
import { useDispatch } from "react-redux";

import { startSim } from "@/actions/sim-start";

import styles from "./SimControls.module.css";

const PlayPauseButton: React.FC = () => {
  const dispatch = useDispatch();
  const onPlayClick = React.useCallback(() => {
    dispatch(startSim());
  }, []);

  return (
    <svg
      className={styles["simctrls-buttom-play"]}
      width={16}
      height={16}
      onClick={onPlayClick}
    >
      <path d="M0,0 L10,8 L0,16 z" />
    </svg>
  );
};

export default PlayPauseButton;
