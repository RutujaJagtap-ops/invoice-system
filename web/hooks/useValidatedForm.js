import { useActionState, useState } from "react";
import { initialFormState } from "@/lib/formatState";
import { hasErrors } from "@/lib/validators/common";

export function useValidatedForm({ action, validate, getValues }) {
  const [state, formAction] = useActionState(action, initialFormState);
  const [clientErrors, setClientErrors] = useState({});

  const handleSubmit = (event) => {
    const nextErrors = validate(getValues(event.currentTarget));
    setClientErrors(nextErrors);
    if (hasErrors(nextErrors)) event.preventDefault();
  };

  return {
    state,
    formAction,
    handleSubmit,
    errors: hasErrors(clientErrors) ? clientErrors : state.errors,
  };
}
