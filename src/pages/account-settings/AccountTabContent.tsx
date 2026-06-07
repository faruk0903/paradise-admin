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
  Input,
  Label,
  Row,
} from "reactstrap";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { UploadProofApi } from "../../api/auth/common";
import UseToast from "../../utils/useToast";
import { EditProfileAPi } from "../../api/auth/auth";
import { useAuthStore } from "../../store/auth";

import avatarBlank from "../../assets/images/avatars/3-small.png";

const AccountTabs: React.FC = () => {
  const { setUser, user } = useAuthStore();

  const { mutate: uploadFile } = useMutation(UploadProofApi, {
    onSuccess: (response: any) => {
      if (response?.status) {
        formik.setFieldValue("profile_image", response.url);
      } else {
        UseToast("Please upload image format like JPG, PNG, WEBP", "error");
      }
    },
    onError: (err: any) => UseToast(err, "error"),
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10e6) {
      UseToast("Maximum image file size should be 10MB.", "error");
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      UseToast("Please upload image format like JPG, PNG, WEBP", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    uploadFile(formData);
  };

  const formik = useFormik({
    initialValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      mobileNo: user?.mobileNo ?? "",
      email: user?.email ?? "",
      profile_image: user?.profile_image ?? "",
    },
    validationSchema: Yup.object().shape({
      first_name: Yup.string().trim().required("First name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      mobileNo: Yup.string()
        .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
        .required("Mobile number is required"),
    }),
    onSubmit: (values) => mutate(values),
  });

  const { mutate, isLoading } = useMutation(EditProfileAPi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Profile updated successfully");
      setUser(data?.data);
    },
    onError: (err: any) => UseToast(err, "error"),
  });

  const profileImageSrc = formik.values.profile_image || avatarBlank;

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Profile Details</CardTitle>
        </CardHeader>
        <CardBody className="py-2 my-25">
          <div className="d-flex align-items-center mb-2">
            <img
              className="rounded me-2"
              src={profileImageSrc}
              alt="Profile"
              height="100"
              width="100"
              style={{ objectFit: "cover" }}
              onError={(e: any) => {
                e.target.src = avatarBlank;
              }}
            />
            <div>
              <Button tag={Label} className="mb-75 me-75" size="sm" color="primary">
                Upload Photo
                <Input type="file" onChange={handleImageChange} hidden accept="image/*" />
              </Button>
              <p className="mb-0 text-muted" style={{ fontSize: 12 }}>
                Allowed JPG, PNG or WEBP. Max size 10MB.
              </p>
            </div>
          </div>

          <Form className="mt-2 pt-50" onSubmit={formik.handleSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" htmlFor="first_name">
                  First Name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="first_name"
                  name="first_name"
                  placeholder="John"
                  value={formik.values.first_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!(formik.touched.first_name && formik.errors.first_name)}
                />
                <FormFeedback>{formik.errors.first_name as string}</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" htmlFor="last_name">
                  Last Name
                </Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formik.values.last_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" htmlFor="email">
                  Email <span className="text-danger">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!(formik.touched.email && formik.errors.email)}
                />
                <FormFeedback>{formik.errors.email as string}</FormFeedback>
              </Col>

              <Col sm="6" className="mb-1">
                <Label className="form-label" htmlFor="mobileNo">
                  Mobile Number <span className="text-danger">*</span>
                </Label>
                <Input
                  id="mobileNo"
                  name="mobileNo"
                  placeholder="9876543210"
                  maxLength={10}
                  value={formik.values.mobileNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!(formik.touched.mobileNo && formik.errors.mobileNo)}
                />
                <FormFeedback>{formik.errors.mobileNo as string}</FormFeedback>
              </Col>

              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  color="secondary"
                  outline
                  type="button"
                  onClick={() => formik.resetForm()}
                >
                  Discard
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default AccountTabs;
