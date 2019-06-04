import React, { FunctionComponent, useContext, useState, useEffect } from "react";
import {
  Button,
  Intent,
  FormGroup,
  InputGroup,
} from "@blueprintjs/core";
import { observer } from "mobx-react-lite";
import { useForm } from "../../utils/useForm";
import { StoreContext } from "../../storePovider";

const UpdateProfileForm: FunctionComponent = observer(() => {
  const [name, setName] = useState('');
  const { app } = useContext(StoreContext);

  useEffect(() => {
    setName(app.auth.user.name);
  }, [])

  const { loading, error, submitHandler } = useForm(async () => {
    await app.auth.updateProfile({ name });
  });

  return (
    <form onSubmit={submitHandler}>
      <FormGroup
        intent={error && error.data.name ? "danger" : "none"}
        helperText={error && error.data.name}
        label="Name">
        <InputGroup 
          disabled={loading}
          leftIcon="user"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          />
      </FormGroup>

      <Button type="submit" intent={Intent.PRIMARY} loading={loading}>
        Update Profile
      </Button>
    </form>
  );
});

export default UpdateProfileForm;
