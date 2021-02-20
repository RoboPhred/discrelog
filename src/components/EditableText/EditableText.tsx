import * as React from "react";

export interface EditableTextProps {
  defaultValue: string;
  isEditing: boolean;
  onConfirm(value: string): void;
  onCancel(): void;
}

const EditableText: React.FC<EditableTextProps> = ({
  defaultValue,
  isEditing,
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] = React.useState(defaultValue);

  const onInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const onInputKeyPress = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm(value);
      }
    },
    [onCancel, onConfirm, value]
  );

  const onInputBlur = React.useCallback(() => {
    onConfirm(value);
  }, [onConfirm, value]);

  if (!isEditing) {
    return <span>{defaultValue}</span>;
  }

  return (
    <input
      autoFocus
      defaultValue={defaultValue}
      type="text"
      onChange={onInputChange}
      onKeyPress={onInputKeyPress}
      onBlur={onInputBlur}
    />
  );
};

export default EditableText;
