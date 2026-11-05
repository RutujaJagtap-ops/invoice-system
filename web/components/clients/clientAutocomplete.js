"use client";

import { useEffect, useRef, useState } from "react";
import { Autocomplete } from "@mui/material";
import FormTextField from "@/components/ui/formTextField";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const keepAll = (options) => options;
const getOptionLabel = (option) => option.name;
const isSameClient = (option, value) => option.id === value.id;

export default function ClientAutocomplete({ value, onChange, error }) {
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => () => controllerRef.current?.abort(), []);

  const loadOptions = async (query) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    try {
      const response = await fetch(`/api/clients/search?q=${encodeURIComponent(query)}`, { signal: controller.signal });
      setOptions(response.ok ? await response.json() : []);
      setLoading(false);
    } catch (error) {
      if (error.name !== "AbortError") {
        setOptions([]);
        setLoading(false);
      }
    }
  };

  const debouncedLoad = useDebouncedCallback(loadOptions, 300);

  const handleOpen = () => {
    if (!options.length) loadOptions("");
  };
  const handleInputChange = (_event, text, reason) => {
    setInputValue(text);
    if (reason === "input") debouncedLoad(text.trim());
  };
  const handleChange = (_event, client) => onChange(client);
  const renderInput = (params) => <FormTextField {...params} label="Client" error={error} />;

  const mergedOptions = value && !options.some((option) => option.id === value.id) ? [value, ...options] : options;

  return (
    <Autocomplete
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      onOpen={handleOpen}
      options={mergedOptions}
      loading={loading}
      filterOptions={keepAll}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isSameClient}
      noOptionsText="No clients found"
      renderInput={renderInput}
    />
  );
}