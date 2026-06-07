import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Button,
} from "reactstrap";

import illustrationsLight from "../../assets/images/pages/login-v2.svg";
import "../../assets/scss/react/pages/page-authentication.scss";
import InputPasswordToggle from "../../components/input-password-toggle/index";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../utils/useToast";
import { ResetPasswordApi } from "../../api/auth/auth";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        newPassword: "",
        confirmPassword: "",
      },
      validationSchema: Yup.object().shape({
        newPassword: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .required("New password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("newPassword")], "Passwords must match")
          .required("Please confirm your password"),
      }),
      onSubmit: (values) => {
        mutate({ token, newPassword: values.newPassword, confirmPassword: values.confirmPassword });
      },
    });

  const { mutate, isLoading } = useMutation(ResetPasswordApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Password reset successfully");
      navigate("/sign-in");
    },
    onError: (err: any) => {
      UseToast(err || "Something went wrong", "error");
    },
  });

  return (
    <div className="auth-wrapper auth-cover">
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <h2 className="brand-text text-primary ms-1">Paradise Developer</h2>
        </Link>

        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={illustrationsLight} alt="Reset Password" />
          </div>
        </Col>

        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1">
              Reset Password 🔒
            </CardTitle>
            <CardText className="mb-2">
              Enter your new password below.
            </CardText>

            <Form onSubmit={handleSubmit}>
              <div className="mb-1">
                <Label htmlFor="newPassword" className="form-label">
                  New Password <span className="text-danger">*</span>
                </Label>
                <InputPasswordToggle
                  name="newPassword"
                  id="newPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.newPassword}
                  className="input-group-merge"
                  htmlFor="newPassword"
                />
                {touched.newPassword && errors.newPassword && (
                  <div className="text-danger mt-25" style={{ fontSize: 12 }}>
                    {errors.newPassword}
                  </div>
                )}
              </div>

              <div className="mb-1">
                <Label htmlFor="confirmPassword" className="form-label">
                  Confirm Password <span className="text-danger">*</span>
                </Label>
                <InputPasswordToggle
                  name="confirmPassword"
                  id="confirmPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  className="input-group-merge"
                  htmlFor="confirmPassword"
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <div className="text-danger mt-25" style={{ fontSize: 12 }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                color="primary"
                block
                className="mt-1"
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Set New Password"}
              </Button>
            </Form>

            <p className="text-center mt-2">
              <Link to="/sign-in">Back to login</Link>
            </p>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
