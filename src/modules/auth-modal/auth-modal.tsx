import { useState } from "react";
import { InputUI } from "../../shared/input-ui/input-ui";
import { isValidEmail } from "../../features/hooks/isValidEmail";

import styles from "./auth-modal.module.scss";
import { isValidPassword } from "../../features/hooks/isValidPassword";
import { registerUserApi } from "../../services/api/auth-api";
import { ButtonUI } from "../../shared/button-ui/button-ui";
import { authErrors } from "../../utils/errors";
import { useAuth } from "../../services/zustand/store";

type Props = {
  isLogin: boolean;
};

export const AuthModal = ({ isLogin }: Props) => {
  const { login } = useAuth();
  const [values, setValues] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [apiError, setApiError] = useState<string>("");

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: value !== "" && !isValidEmail(value),
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: value !== "" && !isValidPassword(value),
      }));
    }
  };

  const handleSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    const newErrors = {
      email: values.email.trim() === "" || !isValidEmail(values.email),
      password:
        values.password.trim() === "" || !isValidPassword(values.password),
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((e) => e);

    if (hasErrors) return;

    try {
      if (isLogin) {
        await login(values.email, values.password);
      } else {
        await registerUserApi(values.email, values.password);
      }
      setValues({ email: "", password: "" });
      setErrors({ email: false, password: false });
      setApiError("");
    } catch (err: any) {
      const message =
        authErrors[err.message as keyof typeof authErrors] || "Unknown error";
      setApiError(message);
      console.log(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>{isLogin ? "Log in" : "Sign in"}</h2>
      <InputUI
        title="Email"
        isError={(errors.email && !values.email) || errors.email || !!apiError}
        errorText={
          apiError ||
          (values.email !== "" ? "example@domain.com" : "Field is required!")
        }
      >
        <input
          type="text"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
      </InputUI>
      <InputUI
        title="Password"
        isError={(errors.password && !values.password) || errors.password}
        errorText={
          values.email !== ""
            ? "8+ chars, uppercase, lowercase, number, special character"
            : "Field is required!"
        }
      >
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
        />
      </InputUI>
      <ButtonUI type="submit">{isLogin ? "Log In" : "Sign Up"}</ButtonUI>
    </form>
  );
};
