import { useState } from "react";
import { isValidationError, isJsonError } from "./errorHandler";
import { useMounted } from "./useMounted";
import { JsonError } from "../../../types/common";

// TODO: change to axios type
type submitFunction = () => Promise<any>

export const useForm = (submit: submitFunction) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<JsonError | null>(null);
  const mounted = useMounted();

  const submitHandler = async(event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await submit();
    } catch (e) {
      if(isJsonError(e) && isValidationError(e)) {
        setError(e.response.data.error);
      }
    }

    if(mounted.current) {
      setLoading(false);
    }
  }

  return { submitHandler, loading, error };
}
