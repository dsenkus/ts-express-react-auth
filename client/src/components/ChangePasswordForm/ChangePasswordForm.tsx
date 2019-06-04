import React, { FunctionComponent, useState, useContext } from "react";
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
import { useForm } from "../../utils/useForm";
import { StoreContext } from "../../storePovider";

const ChangePasswordForm: FunctionComponent = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { app } = useContext(StoreContext);

  const { loading, error, submitHandler } = useForm(async () => {
    await app.auth.changePassword(password, currentPassword, confirmPassword);
  });

  return (
    <form onSubmit={submitHandler}>
      <FormGroup
        intent={error && error.data.currentPassword ? "danger" : "none"}
        helperText={error && error.data.currentPassword}
        label="Old Password">
        <InputGroup 
          disabled={loading}
          type="password"
          name="old_password"
          value={currentPassword}
          onChange={(e: any) => setCurrentPassword(e.target.value)}
          />
      </FormGroup>

      <FormGroup
        intent={error && error.data.password ? "danger" : "none"}
        helperText={error && error.data.password}
        label="Password">
        <InputGroup 
          disabled={loading}
          type="password"
          name="new_password"
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
          />
      </FormGroup>

      <FormGroup
        intent={error && error.data.confirmPassword ? "danger" : "none"}
        helperText={error && error.data.confirmPassword}
        label="Confirm Password">
        <InputGroup 
          disabled={loading}
          type="password"
          name="confirm_new_password"
          value={confirmPassword}
          onChange={(e: any) => setConfirmPassword(e.target.value)}
          />
      </FormGroup>

      <Button type="submit" intent={Intent.PRIMARY} loading={loading}>
        Update Password
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
