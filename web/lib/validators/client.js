import { EMAIL_PATTERN, GSTIN_PATTERN, PHONE_PATTERN, isBlank } from "./common.js";

export function validateClient({ name = "", email = "", phone = "", gstin = "" }) {
  const errors = {};
  if (isBlank(name)) errors.name = "Name is required";
  else if (name.trim().length > 120) errors.name = "Name must be 120 characters or fewer";

  if (isBlank(email)) errors.email = "Email is required";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Enter a valid email address";

  if (!isBlank(phone) && !PHONE_PATTERN.test(phone.trim())) errors.phone = "Enter a valid phone number";
  if (!isBlank(gstin) && !GSTIN_PATTERN.test(gstin.trim().toUpperCase())) {
    errors.gstin = "Enter a valid 15-character GSTIN";
  }
  return errors;
}