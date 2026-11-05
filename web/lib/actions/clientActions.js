"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { TAGS } from "@/lib/constants";
import { failure } from "@/lib/formatState";
import { mutate, toId } from "@/lib/mutations";
import { hasErrors } from "@/lib/validators/common";
import { validateClient } from "@/lib/validators/client";

const FIELDS = ["name", "email", "phone", "gstin", "address"];

const readClient = (formData) => {
  const values = Object.fromEntries(FIELDS.map((field) => [field, String(formData.get(field) ?? "").trim()]));
  return { ...values, gstin: values.gstin.toUpperCase() };
};

export async function saveClient(id, _prevState, formData) {
  const values = readClient(formData);
  const errors = validateClient(values);
  if (hasErrors(errors)) return failure(errors, values);

  const result = await mutate(id ? `/clients/${toId(id)}/` : "/clients/", {
    method: id ? "PUT" : "POST",
    body: values,
  });
  if (!result.ok) return failure(result.errors, values);

  updateTag(TAGS.clients);
  if (id) {
    updateTag(TAGS.client(id));
    updateTag(TAGS.invoices); // invoices show the client name
  }
  redirect(`/clients/${result.data.id}`);
}

export async function deleteClient(id) {
  const result = await mutate(`/clients/${toId(id)}/`, { method: "DELETE" });
  if (!result.ok) return failure(result.errors);
  updateTag(TAGS.clients);
  redirect("/clients");
}