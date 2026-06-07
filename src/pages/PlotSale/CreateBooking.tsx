import { useEffect } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  Label,
  Input,
  Button,
  Form,
  FormGroup,
  FormFeedback,
} from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { GetAllSiteApi } from "../../api/site";
import { UploadProofApi } from "../../api/auth/common";
import UseToast from "../../utils/useToast";
import { addBookingApi } from "../../api/plotSale";

const SaleCreate = () => {
  const navigate = useNavigate();

  // 🔹 Get Sites
  const { data: SiteData } = useQuery<any>(
    ["GetUsersApi"],
    () => GetAllSiteApi(1, 100, ""),
    {
      onSuccess: () => {},
    }
  );

  // 🔹 Validation Schema
  const validationSchema = Yup.object({
    siteId: Yup.string().required("Site is required"),
    customerName: Yup.string().required("Customer name is required"),
    customerMobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
      .required("Mobile is required"),
    plotNumbers: Yup.string().required("Plot numbers required"),
    sqYards: Yup.number().positive().required("Sq. yards required"),
    rate: Yup.number().positive().required("Rate required"),

    paymentDurationMonths: Yup.number()
      .positive()
      .required("Duration required"),

    // 🔹 Advance conditional
    advanceAmount: Yup.number().when("isAdvance", {
      is: true,
      then: (schema) =>
        schema
          .positive("Advance must be positive")
          .required("Advance amount required"),
    }),
    advancePaymentType: Yup.string().when("isAdvance", {
      is: true,
      then: (schema) => schema.required("Payment type required"),
    }),
    advanceChequeNumber: Yup.string().when(
      ["isAdvance", "advancePaymentType"],
      {
        is: (isAdvance: boolean, type: string) =>
          isAdvance && type === "cheque",
        then: (schema) => schema.required("Cheque number required"),
      }
    ),
  });

  // 🔹 Formik
  const formik = useFormik({
    initialValues: {
      siteId: "",
      customerName: "",
      customerMobile: "",
      plotNumbers: "",
      sqYards: "",
      rate: "",
      paymentDurationMonths: "",
      advanceAmount: "",
      advancePaymentType: "cash",
      advanceChequeNumber: "",
      advancePaymentProof: "",
      totalAmount: 0,
      isAdvance: false,
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        siteId: values.siteId,
        customerName: values.customerName,
        customerMobile: values.customerMobile,
        plotNumbers: values.plotNumbers.split(",").map((p: string) => p.trim()),
        sqYards: Number(values.sqYards),
        rate: Number(values.rate),
        paymentDurationMonths: Number(values.paymentDurationMonths),
        advanceAmount: values.isAdvance ? Number(values.advanceAmount) : 0,
        advancePaymentType: values.advancePaymentType,
        advanceChequeNumber: values.advanceChequeNumber,
        advancePaymentProof: values.advancePaymentProof,
      });
    },
  });

  // 🔹 Mutation
  const { mutate, isLoading } = useMutation(addBookingApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Sale created successfully");
      navigate("/bookingList");
    },
    onError: (err: any) => {
      UseToast(err || "Something went wrong", "error");
    },
  });
  const { mutate: mutateUploadFile } = useMutation(
    UploadProofApi,
    {
      onSuccess: (response: any) => {
        if (response.status) {
          formik.setFieldValue?.("advancePaymentProof", response.url);
        } else {
          UseToast(
            "Please upload image format like JPG, PNG,JPEG,WEBP etc",
            "error"
          );
        }
      },
      onError: (err: any) => {
        UseToast(err, "error");
      },
    }
  );

  const handleProofUpload = async (e: any) => {
    const file = e.target.files[0];

    if (file) {
      if (file.size > 10e6) {
        UseToast("Maximum image file size should be 10MB.", "error");
        return false;
      }

      if (
        file.type == "image/png" ||
        file.type == "image/jpeg" ||
        file.type == "image/jpg" ||
        file.type == "image/webp"
      ) {
        // console.log(file, "IMAGE FILE");

        const reader = new FileReader();
        if (e) {
          reader.onload = () => {
            // setAvatar(e.target.result);
            // console.log(e.target.result, "SDFSDFSDFSDFSDFFD");
          };
          const formData = new FormData();

          // formData.append("folder", "CUSTOMER");

          formData.append("image", e.currentTarget.files[0]);

          // console.log(e.currentTarget.files[0], "SDdfsdfsdff");

          mutateUploadFile(formData);

          reader.readAsDataURL(file);
        }
      } else {
        UseToast(
          "Please upload image format like JPG, PNG,JPEG,WEBP etc",
          "error"
        );
      }
    }
  };
  useEffect(() => {
    const sq = Number(formik.values.sqYards || 0);
    const rate = Number(formik.values.rate || 0);
    const total = sq * rate;

    formik.setFieldValue("totalAmount", total);
  }, [formik.values.sqYards, formik.values.rate]);

  return (
    <Card>
      <CardBody>
        <h4 className="mb-2">Create Plot Sale</h4>

        <Form onSubmit={formik.handleSubmit}>
          <Row>
            {/* Site */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Site <span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  name="siteId"
                  value={formik.values.siteId}
                  onChange={formik.handleChange}
                  invalid={!!(formik.touched.siteId && formik.errors.siteId)}
                >
                  <option value="">Select Site</option>
                  {SiteData?.data?.map((s: any) => (
                    <option key={s._id} value={s._id}>
                      {s.siteName}
                    </option>
                  ))}
                </Input>
                <FormFeedback>{formik.errors.siteId}</FormFeedback>
              </FormGroup>
            </Col>

            {/* Customer */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Customer Name <span className="text-danger">*</span>
                </Label>
                <Input
                  name="customerName"
                  value={formik.values.customerName}
                  onChange={formik.handleChange}
                  invalid={
                    !!(
                      formik.touched.customerName && formik.errors.customerName
                    )
                  }
                />
                <FormFeedback>{formik.errors.customerName}</FormFeedback>
              </FormGroup>
            </Col>

            <Col md="4">
              <FormGroup>
                <Label>
                  Mobile <span className="text-danger">*</span>
                </Label>
                <Input
                  name="customerMobile"
                  value={formik.values.customerMobile}
                  onChange={formik.handleChange}
                  maxLength={10}
                  invalid={
                    !!(
                      formik.touched.customerMobile &&
                      formik.errors.customerMobile
                    )
                  }
                />
                <FormFeedback>{formik.errors.customerMobile}</FormFeedback>
              </FormGroup>
            </Col>

            {/* Plot Numbers */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Plot Numbers <span className="text-danger">*</span>
                </Label>
                <Input
                  name="plotNumbers"
                  placeholder="11,12,10"
                  value={formik.values.plotNumbers}
                  onChange={formik.handleChange}
                  invalid={
                    !!(formik.touched.plotNumbers && formik.errors.plotNumbers)
                  }
                />
                <FormFeedback>{formik.errors.plotNumbers}</FormFeedback>
              </FormGroup>
            </Col>

            {/* Sq yards */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Sq. Yards <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="sqYards"
                  value={formik.values.sqYards}
                  onChange={formik.handleChange}
                  invalid={!!(formik.touched.sqYards && formik.errors.sqYards)}
                />
                <FormFeedback>{formik.errors.sqYards}</FormFeedback>
              </FormGroup>
            </Col>

            {/* Rate */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Rate <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="rate"
                  value={formik.values.rate}
                  onChange={formik.handleChange}
                  invalid={!!(formik.touched.rate && formik.errors.rate)}
                />
                <FormFeedback>{formik.errors.rate}</FormFeedback>
              </FormGroup>
            </Col>

            {/* Duration */}
            <Col md="4">
              <FormGroup>
                <Label>
                  Duration (Months) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="paymentDurationMonths"
                  value={formik.values.paymentDurationMonths}
                  onChange={formik.handleChange}
                  invalid={
                    !!(
                      formik.touched.paymentDurationMonths &&
                      formik.errors.paymentDurationMonths
                    )
                  }
                />
                <FormFeedback>
                  {formik.errors.paymentDurationMonths}
                </FormFeedback>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <Label>Total Amount</Label>
                <Input
                  type="number"
                  name="totalAmount"
                  value={formik.values.totalAmount}
                  disabled // 👈 NOT editable
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Advance */}
          <Row className="mt-2">
            <Col>
              <FormGroup check>
                <Input
                  type="checkbox"
                  name="isAdvance"
                  checked={formik.values.isAdvance}
                  onChange={(e) => {
                    formik.setFieldValue("isAdvance", e.target.checked);
                  }}
                />{" "}
                <Label check>Advance Payment Received</Label>
              </FormGroup>
            </Col>
          </Row>

          {formik.values.isAdvance && (
            <Row className="mt-1">
              <Col md="4">
                <Label>Advance Amount</Label>
                <Input
                  type="number"
                  name="advanceAmount"
                  value={formik.values.advanceAmount}
                  onChange={formik.handleChange}
                  invalid={
                    !!(
                      formik.touched.advanceAmount &&
                      formik.errors.advanceAmount
                    )
                  }
                />
                <FormFeedback>{formik.errors.advanceAmount}</FormFeedback>
              </Col>

              <Col md="4">
                <Label>Payment Type</Label>
                <Input
                  type="select"
                  name="advancePaymentType"
                  value={formik.values.advancePaymentType}
                  onChange={formik.handleChange}
                >
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                </Input>
              </Col>

              {formik.values.advancePaymentType === "cheque" && (
                <Col md="4">
                  <Label>Cheque Number</Label>
                  <Input
                    name="advanceChequeNumber"
                    value={formik.values.advanceChequeNumber}
                    onChange={formik.handleChange}
                    invalid={
                      !!(
                        formik.touched.advanceChequeNumber &&
                        formik.errors.advanceChequeNumber
                      )
                    }
                  />
                  <FormFeedback>
                    {formik.errors.advanceChequeNumber}
                  </FormFeedback>
                </Col>
              )}
            </Row>
          )}
          {formik.values.isAdvance &&
            (formik.values.advancePaymentType === "cheque" ||
              formik.values.advancePaymentType === "online") && (
              <Col md="4">
                <Label>Payment Proof</Label>
                <Input type="file" onChange={handleProofUpload} />

                {/* ✅ Preview after upload */}
                {formik.values.advancePaymentProof && (
                  <div className="mt-1">
                    <small className="text-success">
                      Proof uploaded successfully
                    </small>

                    <div
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        padding: 5,
                        width: 120,
                      }}
                    >
                      <img
                        src={formik.values.advancePaymentProof}
                        alt="Payment Proof"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                )}
              </Col>
            )}

          {/* Submit */}
          <Row className="mt-3">
            <Col>
              <Button color="primary" disabled={isLoading}>
                {isLoading ? "Saving..." : "Create Sale"}
              </Button>
              <Button
                type="button"
                color="secondary"
                className="ms-1"
                onClick={() => navigate("/bookingList")}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default SaleCreate;
