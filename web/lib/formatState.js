export const initialFormState = { ok: false, errors: {}, values: null };
export const failure = (errors, values = null) => ({ ok: false, errors, values });
export const success = () => ({ ok: true, errors: {}, values: null });