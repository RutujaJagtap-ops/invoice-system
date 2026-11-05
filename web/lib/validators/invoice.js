import { GST_RATES } from "../constants.js";
import { ISO_DATE_PATTERN, MONEY_PATTERN, isBlank } from "./common.js";

const MAX_QUANTITY = 999999;
const MAX_PRICE = 9999999999;

function validateItem({ description, quantity, unit_price: unitPrice }) {
  const errors = {};
  if (isBlank(description)) errors.description = "Description is required";
  if (!MONEY_PATTERN.test(String(quantity)) || Number(quantity) <= 0 || Number(quantity) > MAX_QUANTITY) {
    errors.quantity = "Enter a quantity above 0";
  }
  if (!MONEY_PATTERN.test(String(unitPrice)) || Number(unitPrice) > MAX_PRICE) {
    errors.unit_price = "Enter a valid price";
  }
  return Object.keys(errors).length ? errors : null;
}

export function validateInvoice({ client, issue_date: issueDate, due_date: dueDate, gst_rate: gstRate, notes = "", items = [] }) {
  const errors = {};
  if (!client?.id) errors.client = "Select a client";
  if (!ISO_DATE_PATTERN.test(issueDate ?? "")) errors.issue_date = "Enter an issue date";
  if (!ISO_DATE_PATTERN.test(dueDate ?? "")) errors.due_date = "Enter a due date";
  else if (!errors.issue_date && dueDate < issueDate) errors.due_date = "Due date cannot be before the issue date";
  if (!GST_RATES.includes(Number(gstRate))) errors.gst_rate = "Choose a valid GST rate";
  if (String(notes).length > 500) errors.notes = "Notes must be 500 characters or fewer";

  if (!items.length) {
    errors.items = "Add at least one line item";
  } else {
    const itemErrors = items.map(validateItem);
    if (itemErrors.some(Boolean)) errors.items = itemErrors;
  }
  return errors;
}