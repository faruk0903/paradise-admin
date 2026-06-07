import { Fragment } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Form,
  FormFeedback,
  Row,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";
import InputPasswordToggle from "../../components/input-password-toggle/index";
import { ChangePasswordApi } from "../../api/auth/auth";
import UseToast from "../../utils/useToast";
import { useMutation } from "@tanstack/react-query";

const SecurityTabContent = () => {
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object().shape({
      oldPassword: Yup.string()
        .min(8, "Current password must be at least 8 characters")
        .required("Current password is required"),
      newPassword: Yup.string()
        .min(8, "New password must be at least 8 characters")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your new password"),
    }),
    onSubmit: (values) => mutate(values),
  });

  const { mutate, isLoading } = useMutation(ChangePasswordApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Password changed successfully");
      formik.resetForm();
    },
    onError: (err: any) => UseToast(err, "error"),
  });

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Change Password</CardTitle>
        </CardHeader>
        <CardBody className="pt-1">
          <Form onSubmit={formik.handleSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  name="oldPassword"
                  label="Current Password"
                  htmlFor="oldPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.oldPassword}
                  className="input-group-merge"
                />
                {formik.touched.oldPassword && formik.errors.oldPassword && (
                  <FormFeedback className="d-block">
                    {formik.errors.oldPassword}
                  </FormFeedback>
                )}
              </Col>
            </Row>

            <Row>
              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  name="newPassword"
                  label="New Password"
                  htmlFor="newPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.newPassword}
                  className="input-group-merge"
                />
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <FormFeedback className="d-block">
                    {formik.errors.newPassword}
                  </FormFeedback>
                )}
              </Col>

              <Col sm="6" className="mb-1">
                <InputPasswordToggle
                  name="confirmPassword"
                  label="Confirm New Password"
                  htmlFor="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="input-group-merge"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <FormFeedback className="d-block">
                      {formik.errors.confirmPassword}
                    </FormFeedback>
                  )}
              </Col>

              <Col xs={12} className="mb-1">
                <p className="fw-bolder">Password requirements:</p>
                <ul className="ps-1 ms-25">
                  <li className="mb-50">Minimum 8 characters</li>
                </ul>
              </Col>

              <Col sm="12">
                <Button
                  type="submit"
                  className="me-1"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  color="secondary"
                  outline
                  type="button"
                  onClick={() => formik.resetForm()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SecurityTabContent;
