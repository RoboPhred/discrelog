import * as React from "react";

export interface AtomicTextInputProps {
  className?: string;
  autoFocus?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?(e: React.ChangeEvent<HTMLInputElement>): void;
  onBeginEdit?(): void;
  onCommit?(value: string): void;
  onCancel?(): void;
  onKeyUp?(e: React.KeyboardEvent<HTMLInputElement>): void;
  onBlur?(e: React.FocusEvent<HTMLInputElement>): void;
}

const AtomicTextInput = React.forwardRef<
  HTMLInputElement,
  AtomicTextInputProps
>(
  (
    {
      className,
      autoFocus,
      defaultValue,
      value,
      onChange,
      onBeginEdit,
      onCommit,
      onCancel,
      onBlur,
      onKeyUp,
    },
    ref
  ) => {
    const [editValue, setEditValue] = React.useState<string | null>(null);

    const onInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (editValue == null && onBeginEdit) {
          onBeginEdit();
        }

        setEditValue(e.target.value);

        if (onChange) {
          onChange(e);
        }
      },
      [editValue, onBeginEdit, onChange]
    );

    const onInputKeyUp = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (onKeyUp) {
          onKeyUp(e);
        }
        if (e.defaultPrevented) {
          return;
        }

        if (editValue == null) {
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          if (onCancel) {
            onCancel();
          }
        } else if (e.key === "Enter") {
          e.preventDefault();
          if (onCommit) {
            onCommit(editValue);
          }
        }
      },
      [onKeyUp, editValue, onCancel, onCommit]
    );

    const onInputBlur = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (onBlur) {
          onBlur(e);
        }

        if (editValue != null && onCommit) {
          onCommit(editValue);
        }
      },
      [onBlur, editValue, onCommit]
    );

    return (
      <input
        ref={ref}
        className={className}
        autoFocus={autoFocus}
        defaultValue={defaultValue}
        value={value}
        type="text"
        onChange={onInputChange}
        onKeyUp={onInputKeyUp}
        onBlur={onInputBlur}
      />
    );
  }
);

export default AtomicTextInput;
