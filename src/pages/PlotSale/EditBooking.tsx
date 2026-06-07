import { Fragment, useEffect } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from "reactstrap";

import BreadCrumbs from "../../components/breadcrumbs";
import UseToast from "../../utils/useToast";
import { GetBookingByIdApi, UpdateBookingApi } from "../../api/plotSale";

const EditBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    customerName: Yup.string().trim().required("Customer name is required"),
    customerMobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
      .required("Mobile is required"),
    plotNumbers: Yup.string().trim().required("Plot numbers required"),
    sqYards: Yup.number().positive("Must be positive").required("Sq. yards required"),
    rate: Yup.number().positive("Must be positive").required("Rate required"),
    paymentDurationMonths: Yup.number()
      .positive("Must be positive")
      .required("Duration required"),
  });

  const formik = useFormik({
    initialValues: {
      siteName: "",
      customerName: "",
      customerMobile: "",
      plotNumbers: "",
      sqYards: "",
      rate: "",
      paymentDurationMonths: "",
      totalPaid: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      mutate({
        id: state?.id,
        customerName: values.customerName,
        customerMobile: values.customerMobile,
        plotNumbers: values.plotNumbers
          .split(",")
          .map((p: string) => p.trim())
          .filter(Boolean),
        sqYards: Number(values.sqYards),
        rate: Number(values.rate),
        paymentDurationMonths: Number(values.paymentDurationMonths),
      });
    },
  });

  const { setFieldValue, values } = formik;

  useQuery(["booking", state?.id], () => GetBookingByIdApi(state?.id), {
    enabled: !!state?.id,
    onSuccess: (data: any) => {
      const sale = data?.data;
      if (!sale) return;
      setFieldValue("siteName", sale?.siteId?.siteName || "");
      setFieldValue("customerName", sale?.customerName || "");
      setFieldValue("customerMobile", sale?.customerMobile || "");
      setFieldValue("plotNumbers", (sale?.plotNumbers || []).join(", "));
      setFieldValue("sqYards", sale?.sqYards ?? "");
      setFieldValue("rate", sale?.rate ?? "");
      setFieldValue("paymentDurationMonths", sale?.paymentDurationMonths ?? "");
      setFieldValue("totalPaid", sale?.totalPaid ?? 0);
    },
  });

  const { mutate, isLoading } = useMutation(UpdateBookingApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Booking updated successfully");
      navigate("/bookingList");
    },
    onError: (err: any) => {
      UseToast(err || "Something went wrong", "error");
    },
  });

  const totalAmount = Number(values.sqYards || 0) * Number(values.rate || 0);

  useEffect(() => {
    if (!state?.id) navigate("/bookingList");
  }, [state]);

  return (
    <Fragment>
      <div className="p-2">
        <BreadCrumbs
          title="Edit Booking"
          data={[
            { title: "Booking", link: "/bookingList" },
            { title: "Edit" },
          ]}
        />
      </div>

      <Row>
        <Col className="d-flex w-full justify-content-end">
          <Button
            onClick={() => navigate("/bookingList")}
            className="add-permission mt-sm-0 mt-1"
            color="primary"
          >
            Back
          </Button>
        </Col>
      </Row>

      <Card className="mt-1">
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={formik.handleSubmit}>
            <Row>
              <Col md="4" className="mb-1">
                <Label className="form-label">Site</Label>
                <Input type="text" value={values.siteName} disabled />
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Customer Name <span className="text-danger">*</span>
                </Label>
                <Input
                  name="customerName"
                  value={values.customerName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    !!(
                      formik.touched.customerName && formik.errors.customerName
                    )
                  }
                />
                <FormFeedback>{formik.errors.customerName}</FormFeedback>
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Mobile <span className="text-danger">*</span>
                </Label>
                <Input
                  name="customerMobile"
                  maxLength={10}
                  value={values.customerMobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    !!(
                      formik.touched.customerMobile &&
                      formik.errors.customerMobile
                    )
                  }
                />
                <FormFeedback>{formik.errors.customerMobile}</FormFeedback>
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Plot Numbers <span className="text-danger">*</span>
                </Label>
                <Input
                  name="plotNumbers"
                  placeholder="11, 12, 13"
                  value={values.plotNumbers}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={
                    !!(formik.touched.plotNumbers && formik.errors.plotNumbers)
                  }
                />
                <FormFeedback>{formik.errors.plotNumbers}</FormFeedback>
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Sq. Yards <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="sqYards"
                  value={values.sqYards}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!(formik.touched.sqYards && formik.errors.sqYards)}
                />
                <FormFeedback>{formik.errors.sqYards}</FormFeedback>
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Rate <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="rate"
                  value={values.rate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={!!(formik.touched.rate && formik.errors.rate)}
                />
                <FormFeedback>{formik.errors.rate}</FormFeedback>
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">
                  Duration (Months) <span className="text-danger">*</span>
                </Label>
                <Input
                  type="number"
                  name="paymentDurationMonths"
                  value={values.paymentDurationMonths}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
              </Col>

              <Col md="4" className="mb-1">
                <Label className="form-label">Total Amount</Label>
                <Input
                  type="text"
                  value={`₹ ${totalAmount.toLocaleString("en-IN")}`}
                  disabled
                />
              </Col>

              <Col className="mt-2" sm="12">
                <Button
                  type="submit"
                  className="me-1"
                  color="primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default EditBooking;
