import { JsonError } from "../../../types/common";
import { store } from "../storePovider";

export const isJsonError = (e: any) => {
  return Boolean(e.response && e.response.data && e.response.data.error && e.response.data.error.type);
}

export const isValidationError = (e: any) => {
  return Boolean(isJsonError(e) && (e.response.data.error as JsonError).type === 'ValidationError');
}

export const baseErrorHandler = (e: any): JsonError | null => {
  if(e.message === 'Network Error') {
    // connection issues
    store.app.notifications.addFail('Network Error: Could not connect to server');
  } else if(isJsonError(e)) {
    // server responded with error, parse and return it
    const jsonError = e.response.data.error as JsonError;
    return jsonError;
  } else {
    // unkonwn error
    store.app.notifications.addFail('Unknown error: ' + e.message);
  }

  return null;
}
