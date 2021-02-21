import { cls } from "@/utils";
import * as React from "react";
import AtomicTextInput from "./AtomicTextInput";

export interface EditableTextProps {
  className?: string;
  textClassname?: string;
  inputClassname?: string;
  label?: JSX.Element;
  defaultValue: string;
  isEditing: boolean;
  onRequestEdit?(): void;
  onCommit(value: string): void;
  onCancel(): void;
}

const EditableText: React.FC<EditableTextProps> = ({
  className,
  textClassname,
  inputClassname,
  label,
  defaultValue,
  isEditing,
  onRequestEdit,
  onCommit,
  onCancel,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const onSpanDoubleClick = React.useCallback(
    (e: React.MouseEvent) => {
      if (!onRequestEdit) {
        return;
      }
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
      onRequestEdit();
    },
    [onRequestEdit]
  );

  // AtomicTextInput enters editing mode when the user changes something.
  // It will not call cancel on blur.
  // We want to exit when blurred
  const onKeyUp = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape" && isEditing) {
        onCancel();
      }
    },
    [isEditing, onCancel]
  );

  const onBlur = React.useCallback(() => {
    if (isEditing) {
      onCancel();
    }
  }, [isEditing, onCancel]);

  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!isEditing) {
    return (
      <span
        className={cls(className, textClassname)}
        onDoubleClick={onSpanDoubleClick}
      >
        {label ?? defaultValue}
      </span>
    );
  }

  return (
    <AtomicTextInput
      ref={inputRef}
      className={cls(className, inputClassname)}
      autoFocus
      defaultValue={defaultValue}
      onBlur={onBlur}
      onKeyUp={onKeyUp}
      onCommit={onCommit}
      onCancel={onCancel}
    />
  );
};

export default EditableText;
