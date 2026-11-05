"use client";

import { useRef } from "react";
import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { useUrlParams } from "@/hooks/useUrlParams";
import { useDebouncedCallback } from "@/hooks/useDebouncedCallback";

const DEBOUNCE_MS = 400;

export default function SearchField({ placeholder = "Search" }) {
  const { searchParams, update, isPending } = useUrlParams();
  const inputRef = useRef(null);
  const currentSearch = searchParams.get("search") ?? "";

  const debouncedUpdate = useDebouncedCallback(
    (value) => update({ search: value.trim() }),
    DEBOUNCE_MS,
  );

  const handleChange = ({ target: { value } }) => debouncedUpdate(value);

  const handleClear = () => {
    debouncedUpdate.cancel();
    inputRef.current.value = "";
    update({ search: "" });
  };

  return (
    <TextField
      size="small"
      fullWidth
      placeholder={placeholder}
      defaultValue={currentSearch}
      onChange={handleChange}
      inputRef={inputRef}
      sx={{
        maxWidth: 420,
        "& .MuiOutlinedInput-root": {
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.10)",
          borderRadius: 2,
          "&:hover": {
            boxShadow: "0 3px 10px rgba(0, 0, 0, 0.14)",
          },
          "&.Mui-focused": {
            boxShadow: "0 3px 12px rgba(0, 0, 0, 0.16)",
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isPending ? (
                <CircularProgress size={18} />
              ) : (
                currentSearch && (
                  <IconButton
                    size="small"
                    onClick={handleClear}
                    aria-label="Clear search"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              )}
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
