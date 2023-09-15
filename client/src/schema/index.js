import * as yup from "yup";

export const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{3,}$/;
// min 3 characters, 1 upper case letter, 1 lower case letter, 1 numeric digit.

const emailRules = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Required")
    .matches(emailRules, { message: "Invalid email detected" }),

  name: yup
    .string()
    .min(3, "User name must be at least 3 character")
    .max(50, "Too Long!")
    .required("Required"),
  password: yup
    .string()
    .min(3, "Password must be at least 3 character")
    .max(50, "Too Long!")
    .matches(passwordRules, {
      message: "Min 3 characters, 1 upper case letter, 1 lower case letter",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});

export const loginSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
  password: yup.string().required("Required"),
});

//require input email to start password reset
export const resetSchema = yup.object().shape({
  email: yup.string().email("Please enter a valid email").required("Required"),
});

//new password and confirmation
export const newPwdSchema = yup.object().shape({
  password: yup
    .string()
    .min(3, "Password must be at least 3 character")
    .max(50, "Too Long!")
    .matches(passwordRules, {
      message: "Min 3 characters, 1 upper case letter, 1 lower case letter",
    })
    .required("Required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Required"),
});
