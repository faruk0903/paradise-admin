import * as yup from "yup";

export const Validation = {
  websiteName: yup
    .string()

    .required("websiteName is required"),
name: yup
    .string()

    .required("websiteName is required"),
};
