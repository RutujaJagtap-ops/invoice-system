"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import { validateLogin } from "@/lib/validators/auth";

const getFieldSx = ({ palette }) => {
  const focusRing = alpha(palette.primary.main, 0.14);
  const errorRing = alpha(palette.error.main, 0.14);

  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.2,
      backgroundColor: "#f6f8fd",
      transition: "background-color .2s, box-shadow .2s",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(palette.primary.main, 0.18),
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: alpha(palette.primary.main, 0.5),
      },
      "&.Mui-focused": {
        backgroundColor: "#fff",
        boxShadow: `0 0 0 4px ${focusRing}`,
      },
      "&.Mui-error.Mui-focused": { boxShadow: `0 0 0 4px ${errorRing}` },
    },
    "& .MuiInputLabel-root": { fontWeight: 500 },
    "& .MuiFormHelperText-root": { marginLeft: 0.5 },
  };
};

const getButtonSx = ({ palette }) => {
  const shadow = alpha(palette.primary.main, 0.32);

  return {
    height: 48,
    borderRadius: 1.2,
    fontWeight: 600,
    fontSize: 15,
    textTransform: "none",
    boxShadow: `0 8px 18px ${shadow}`,
    transition: "transform .15s, box-shadow .15s",
    "&:hover": {
      boxShadow: `0 10px 22px ${shadow}`,
      transform: "translateY(-1px)",
    },
    "&:active": { transform: "translateY(0)" },
  };
};

const getHintSx = ({ palette }) => ({
  px: 1.5,
  py: 1,
  borderRadius: 2,
  textAlign: "center",
  backgroundColor: alpha(palette.primary.main, 0.06),
  border: `1px dashed ${alpha(palette.primary.main, 0.3)}`,
});

export default function LoginForm({ next }) {
  const router = useRouter();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({
      ...current,
      [name]: undefined,
      form: undefined,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const clientErrors = validateLogin(values);
    if (Object.keys(clientErrors).length) return setErrors(clientErrors);

    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        router.replace(next);
        router.refresh();
        return;
      }
      const data = await response.json().catch(() => ({}));
      setErrors(data.errors ?? { form: "Something went wrong. Try again." });
    } catch {
      setErrors({ form: "Network error. Check your connection." });
    }
    setSubmitting(false);
  };

  //   return (
  //     <Box component="form" noValidate onSubmit={handleSubmit}>
  //       <Stack spacing={2}>
  //         {errors.form && <Alert severity="error">{errors.form}</Alert>}
  //         <TextField
  //           label="Username"
  //           name="username"
  //           autoComplete="username"
  //           autoFocus
  //           value={values.username}
  //           onChange={handleChange}
  //           error={Boolean(errors.username)}
  //           helperText={errors.username}
  //         />
  //         <TextField
  //           label="Password"
  //           name="password"
  //           type="password"
  //           autoComplete="current-password"
  //           value={values.password}
  //           onChange={handleChange}
  //           error={Boolean(errors.password)}
  //           helperText={errors.password}
  //         />
  //         <Button type="submit" variant="contained" size="large" loading={submitting}>
  //           Sign in
  //         </Button>
  //         <Typography variant="caption" color="text.secondary">
  //           Demo login: demo / demo12345
  //         </Typography>
  //       </Stack>
  //     </Box>
  //   );
  // }

  return (
    <Box component="form" noValidate onSubmit={handleSubmit}>
      <Stack spacing={2.5}>
        {errors.form && (
          <Alert severity="error" sx={{ borderRadius: 2.5 }}>
            {errors.form}
          </Alert>
        )}
        <TextField
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          fullWidth
          value={values.username}
          onChange={handleChange}
          error={Boolean(errors.username)}
          helperText={errors.username}
          sx={getFieldSx}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          fullWidth
          value={values.password}
          onChange={handleChange}
          error={Boolean(errors.password)}
          helperText={errors.password}
          sx={getFieldSx}
        />
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          loading={submitting}
          sx={getButtonSx}
        >
          Sign in
        </Button>
        <Box sx={getHintSx}>
          <Typography variant="caption" color="text.secondary">
            Demo login: <strong>demo</strong> / <strong>demo12345</strong>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
