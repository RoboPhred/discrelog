import * as React from "react";
import { Dialog, Button, Intent, InputGroup, Classes } from "@blueprintjs/core";

import { useAction } from "@/hooks/useAction";
import { cancelDialog } from "@/actions/dialog-response-cancel";
import { acceptDialog } from "@/actions/dialog-response-accept";

const CreateCircuitDialog: React.FC = () => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const onCancelDialog = useAction(cancelDialog);
  const onAcceptDialog = useAction(acceptDialog);

  const [circuitName, setCircuitName] = React.useState<string>("");
  const onSetProjectName = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCircuitName(e.target.value);
    },
    []
  );

  const onAccept = React.useCallback(() => {
    if (circuitName === "") {
      return;
    }
    onAcceptDialog(circuitName);
  }, [onAcceptDialog, circuitName]);

  // autofocus on InputGroup is not working.
  React.useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 1);
  }, []);

  return (
    <Dialog
      isOpen={true}
      icon="saved"
      onClose={onCancelDialog}
      title="Create Circuit"
      canEscapeKeyClose={true}
      canOutsideClickClose={true}
    >
      <div className={Classes.DIALOG_BODY}>
        <InputGroup
          inputRef={inputRef}
          placeholder="Circuit Name"
          value={circuitName}
          onChange={onSetProjectName}
        />
      </div>
      <div className={Classes.DIALOG_FOOTER}>
        <div className={Classes.DIALOG_FOOTER_ACTIONS}>
          <Button onClick={onCancelDialog}>Cancel</Button>
          <Button
            intent={Intent.PRIMARY}
            disabled={circuitName === ""}
            onClick={onAccept}
          >
            Create
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateCircuitDialog;
