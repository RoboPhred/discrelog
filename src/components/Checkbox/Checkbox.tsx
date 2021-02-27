import * as React from "react";

import styles from "./Checkbox.module.css";

export interface CheckboxProps {
  className?: string;
  value: boolean;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  value,
  onChange,
  children,
}) => {
  return (
    <label className={className}>
      <span className={styles["checkbox-span"]}>
        <input type="checkbox" checked={value} onChange={onChange} />
      </span>
      {children}
    </label>
  );
};

export default Checkbox;
