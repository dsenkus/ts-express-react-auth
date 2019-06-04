import React, { FunctionComponent, useContext, useState } from 'react';
import { Button, Intent, Dialog, Classes, FormGroup, InputGroup } from '@blueprintjs/core';
import { StoreContext } from '../../storePovider';
import { useForm } from '../../utils/useForm';

const DeleteAccountDialog: FunctionComponent = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const { app } = useContext(StoreContext);

  const { loading, submitHandler, error } = useForm(async () => {
    await app.auth.deleteAccount(password);
  })

  return (
    <div className="DeleteAccountDialog">
      <Button
        onClick={() => setOpen(true)}
        intent={Intent.DANGER}
        text="Delete your account"/>
      <Dialog
        icon="trash"
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Are you sure?">
        <div className={Classes.DIALOG_BODY}>
          <p>Are you sure you want to delete your account? All your data will be permanently deleted from our system.</p>
          <p>Please confirm by entering your account password below:</p>

          <FormGroup
              intent={error && error.data.password ? Intent.DANGER : Intent.NONE}
              helperText={error && error.data.password}>
            <InputGroup
              autoComplete="off"
              type="password"
              name="security_password"
              placeholder="Your Password" 
              value={password}
              disabled={loading}
              onChange={(e: any) => setPassword(e.target.value)} 
              />
          </FormGroup>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              onClick={() => setOpen(false)}
              text="Cancel" />
            <Button
              onClick={submitHandler}
              loading={loading}
              intent={Intent.DANGER}
              text="Delete Account"/>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DeleteAccountDialog;
