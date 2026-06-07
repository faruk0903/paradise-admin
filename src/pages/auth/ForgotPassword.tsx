import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "react-feather";
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
} from "reactstrap";

import illustrationsLight from "../../assets/images/pages/login-v2.svg";
import "../../assets/scss/react/pages/page-authentication.scss";

import { useFormik } from "formik";
import * as Yup from "yup";
import { ForgotPasswordApi } from "../../api/auth/auth";
import { useMutation } from "@tanstack/react-query";
import UseToast from "../../utils/useToast";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);

  const { handleChange, handleBlur, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: { email: "" },
      validationSchema: Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email is required"),
      }),
      onSubmit: (values) => mutate(values),
    });

  const { mutate, isLoading } = useMutation(ForgotPasswordApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Reset link sent to your email");
      setEmailSent(true);
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
            <img className="img-fluid" src={illustrationsLight} alt="Forgot Password" />
          </div>
        </Col>

        <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            {emailSent ? (
              <>
                <CardTitle tag="h2" className="fw-bold mb-1">
                  Check your inbox 📧
                </CardTitle>
                <CardText className="mb-2">
                  We've sent a password reset link to <strong>{values.email}</strong>.
                  The link expires in 1 hour.
                </CardText>
                <p className="text-center mt-2">
                  <Link to="/sign-in" className="d-flex align-items-center justify-content-center">
                    <ChevronLeft size={14} className="me-25" />
                    <span>Back to login</span>
                  </Link>
                </p>
              </>
            ) : (
              <>
                <CardTitle tag="h2" className="fw-bold mb-1">
                  Forgot Password? 😓
                </CardTitle>
                <CardText className="mb-2">
                  Enter your email and we'll send you a link to reset your password.
                </CardText>
                <Form onSubmit={handleSubmit} className="auth-forgot-password-form mt-2">
                  <div className="mb-1">
                    <Label className="form-label" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="john@example.com"
                      className={errors.email && touched.email ? "is-invalid" : ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {touched.email && errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  <Button color="primary" type="submit" block disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </Form>
                <p className="text-center mt-2">
                  <Link to="/sign-in" className="d-flex align-items-center justify-content-center">
                    <ChevronLeft size={14} className="me-25" />
                    <span>Back to login</span>
                  </Link>
                </p>
              </>
            )}
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
