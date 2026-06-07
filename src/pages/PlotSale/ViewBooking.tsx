import { Fragment, useEffect, useState } from "react";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import {
  Badge,
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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from "reactstrap";

import BreadCrumbs from "../../components/breadcrumbs";
import UseToast from "../../utils/useToast";
import { UploadProofApi } from "../../api/auth/common";
import {
  AddInstallmentApi,
  CancelBookingApi,
  GetBookingByIdApi,
  GetInstallmentsApi,
} from "../../api/plotSale";

const statusMeta: Record<string, { color: string; label: string }> = {
  active: { color: "warning", label: "Active" },
  completed: { color: "success", label: "Completed" },
  cancelled: { color: "danger", label: "Cancelled" },
};

const formatAmount = (value: number) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const ViewBooking = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state?.id) navigate("/bookingList");
  }, [state]);

  const { data: bookingRes, refetch: refetchBooking } = useQuery<any>(
    ["booking-view", state?.id],
    () => GetBookingByIdApi(state?.id),
    { enabled: !!state?.id }
  );

  const { data: installmentRes, refetch: refetchInstallments } = useQuery<any>(
    ["installments", state?.id],
    () => GetInstallmentsApi(state?.id),
    { enabled: !!state?.id }
  );

  const [cancelModal, setCancelModal] = useState(false);

  const sale = bookingRes?.data;
  const installments = installmentRes?.data || [];
  const isCompleted = sale?.status === "completed";
  const isCancelled = sale?.status === "cancelled";
  const meta = statusMeta[sale?.status] || statusMeta.active;

  const validationSchema = Yup.object().shape({
    amountPaid: Yup.number()
      .positive("Amount must be positive")
      .max(
        sale?.remainingAmount || 0,
        "Amount cannot exceed remaining balance"
      )
      .required("Amount is required"),
    paymentType: Yup.string().required("Payment type required"),
    chequeNumber: Yup.string().when("paymentType", {
      is: "cheque",
      then: (schema) => schema.required("Cheque number required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      amountPaid: "",
      paymentType: "cash",
      chequeNumber: "",
      paymentProof: "",
      remark: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      mutate(
        {
          plotSaleId: state?.id,
          amountPaid: Number(values.amountPaid),
          paymentType: values.paymentType,
          chequeNumber: values.chequeNumber,
          paymentProof: values.paymentProof,
          remark: values.remark,
        },
        {
          onSuccess: () => resetForm(),
        }
      );
    },
  });

  const { mutate, isLoading } = useMutation(AddInstallmentApi, {
    onSuccess: (data: any) => {
      UseToast(data?.message || "Payment recorded successfully");
      refetchBooking();
      refetchInstallments();
    },
    onError: (err: any) => {
      UseToast(err || "Something went wrong", "error");
    },
  });

  const { mutate: uploadProof, isLoading: uploadLoading } = useMutation(
    UploadProofApi,
    {
      onSuccess: (response: any) => {
        if (response?.status) {
          formik.setFieldValue("paymentProof", response.url);
        } else {
          UseToast("Please upload a valid image (JPG, PNG, WEBP)", "error");
        }
      },
      onError: (err: any) => UseToast(err, "error"),
    }
  );

  const handleProofUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10e6) {
      UseToast("Maximum file size should be 10MB.", "error");
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      UseToast("Please upload image format like JPG, PNG, WEBP", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    uploadProof(formData);
  };

  // ---- Cancel booking flow ----
  const cancelFormik = useFormik({
    initialValues: {
      reason: "",
      refundAmount: "",
      refundPaymentType: "cash",
      refundChequeNumber: "",
      refundProof: "",
    },
    validationSchema: Yup.object().shape({
      reason: Yup.string().trim().required("Cancellation reason is required"),
      refundAmount: Yup.number()
        .min(0, "Refund cannot be negative")
        .max(sale?.totalPaid || 0, "Refund cannot exceed amount paid")
        .required("Refund amount is required"),
      refundChequeNumber: Yup.string().when("refundPaymentType", {
        is: "cheque",
        then: (schema) => schema.required("Cheque number required"),
      }),
    }),
    onSubmit: (values) => {
      cancelMutate({
        id: state?.id,
        reason: values.reason,
        refundAmount: Number(values.refundAmount),
        refundPaymentType: values.refundPaymentType,
        refundChequeNumber: values.refundChequeNumber,
        refundProof: values.refundProof,
      });
    },
  });

  const { mutate: cancelMutate, isLoading: cancelLoading } = useMutation(
    CancelBookingApi,
    {
      onSuccess: (data: any) => {
        UseToast(data?.message || "Booking cancelled successfully");
        setCancelModal(false);
        refetchBooking();
        refetchInstallments();
      },
      onError: (err: any) => UseToast(err || "Something went wrong", "error"),
    }
  );

  const { mutate: uploadRefundProof, isLoading: refundUploadLoading } =
    useMutation(UploadProofApi, {
      onSuccess: (response: any) => {
        if (response?.status) {
          cancelFormik.setFieldValue("refundProof", response.url);
        } else {
          UseToast("Please upload a valid image (JPG, PNG, WEBP)", "error");
        }
      },
      onError: (err: any) => UseToast(err, "error"),
    });

  const handleRefundProofUpload = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10e6) {
      UseToast("Maximum file size should be 10MB.", "error");
      return;
    }

    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.type)) {
      UseToast("Please upload image format like JPG, PNG, WEBP", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    uploadRefundProof(formData);
  };

  return (
    <Fragment>
      <div className="p-2">
        <BreadCrumbs
          title="Booking Details"
          data={[
            { title: "Booking", link: "/bookingList" },
            { title: "Details" },
          ]}
        />
      </div>

      <Row>
        <Col className="d-flex w-full justify-content-end gap-1">
          {!isCancelled && (
            <Button
              onClick={() => {
                cancelFormik.resetForm();
                cancelFormik.setFieldValue("refundAmount", sale?.totalPaid || 0);
                setCancelModal(true);
              }}
              className="mt-sm-0 mt-1"
              color="danger"
            >
              Cancel Booking
            </Button>
          )}
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
        <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
          <CardTitle tag="h4">Booking Summary</CardTitle>
          <Badge color={meta.color}>{meta.label}</Badge>
        </CardHeader>
        <CardBody className="pt-2">
          <Row>
            <Col md="4" className="mb-1">
              <strong>Site:</strong> {sale?.siteId?.siteName || "-"}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Customer:</strong> {sale?.customerName || "-"}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Mobile:</strong> {sale?.customerMobile || "-"}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Plot Numbers:</strong>{" "}
              {(sale?.plotNumbers || []).join(", ") || "-"}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Sq. Yards:</strong> {sale?.sqYards ?? "-"}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Rate:</strong> {formatAmount(sale?.rate)}
            </Col>
            <Col md="4" className="mb-1">
              <strong>Duration:</strong> {sale?.paymentDurationMonths ?? "-"}{" "}
              months
            </Col>
            <Col md="4" className="mb-1">
              <strong>Total Amount:</strong> {formatAmount(sale?.totalAmount)}
            </Col>
            <Col md="4" className="mb-1">
              <strong className="text-success">Paid:</strong>{" "}
              {formatAmount(sale?.totalPaid)}
            </Col>
            <Col md="4" className="mb-1">
              <strong className="text-danger">Remaining:</strong>{" "}
              {formatAmount(sale?.remainingAmount)}
            </Col>
          </Row>
        </CardBody>
      </Card>

      {isCancelled && (
        <Card className="mt-1 border-danger">
          <CardHeader className="border-bottom">
            <CardTitle tag="h4" className="text-danger">
              Cancellation Details
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-2">
            <Row>
              <Col md="4" className="mb-1">
                <strong>Reason:</strong>{" "}
                {sale?.cancellationDetails?.reason || "-"}
              </Col>
              <Col md="4" className="mb-1">
                <strong>Refund Amount:</strong>{" "}
                {formatAmount(sale?.cancellationDetails?.refundAmount)}
              </Col>
              <Col md="4" className="mb-1 text-capitalize">
                <strong>Refund Type:</strong>{" "}
                {sale?.cancellationDetails?.refundPaymentType || "-"}
              </Col>
              <Col md="4" className="mb-1">
                <strong>Cheque No.:</strong>{" "}
                {sale?.cancellationDetails?.refundChequeNumber || "-"}
              </Col>
              <Col md="4" className="mb-1">
                <strong>Cancelled On:</strong>{" "}
                {sale?.cancellationDetails?.cancelledAt
                  ? new Date(
                      sale.cancellationDetails.cancelledAt
                    ).toLocaleDateString("en-IN")
                  : "-"}
              </Col>
              <Col md="4" className="mb-1">
                <strong>Refund Receipt:</strong>{" "}
                {sale?.cancellationDetails?.refundProof ? (
                  <a
                    href={sale.cancellationDetails.refundProof}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "-"
                )}
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}

      {!isCompleted && !isCancelled && (
        <Card className="mt-1">
          <CardHeader className="border-bottom">
            <CardTitle tag="h4">Record Payment</CardTitle>
          </CardHeader>
          <CardBody className="pt-2">
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="3" className="mb-1">
                  <Label className="form-label">
                    Amount <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="amountPaid"
                    value={formik.values.amountPaid}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    invalid={
                      !!(
                        formik.touched.amountPaid && formik.errors.amountPaid
                      )
                    }
                  />
                  <FormFeedback>{formik.errors.amountPaid}</FormFeedback>
                </Col>

                <Col md="3" className="mb-1">
                  <Label className="form-label">Payment Type</Label>
                  <Input
                    type="select"
                    name="paymentType"
                    value={formik.values.paymentType}
                    onChange={formik.handleChange}
                  >
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="online">Online</option>
                  </Input>
                </Col>

                {formik.values.paymentType === "cheque" && (
                  <Col md="3" className="mb-1">
                    <Label className="form-label">
                      Cheque Number <span className="text-danger">*</span>
                    </Label>
                    <Input
                      name="chequeNumber"
                      value={formik.values.chequeNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      invalid={
                        !!(
                          formik.touched.chequeNumber &&
                          formik.errors.chequeNumber
                        )
                      }
                    />
                    <FormFeedback>{formik.errors.chequeNumber}</FormFeedback>
                  </Col>
                )}

                {(formik.values.paymentType === "cheque" ||
                  formik.values.paymentType === "online") && (
                  <Col md="3" className="mb-1">
                    <Label className="form-label">Payment Proof</Label>
                    <Input type="file" onChange={handleProofUpload} />
                    {formik.values.paymentProof && (
                      <small className="text-success d-block mt-50">
                        Proof uploaded
                      </small>
                    )}
                  </Col>
                )}

                <Col md="6" className="mb-1">
                  <Label className="form-label">Remark</Label>
                  <Input
                    type="textarea"
                    name="remark"
                    rows="2"
                    placeholder="Optional note for this payment"
                    value={formik.values.remark}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Row>

              <Button
                color="primary"
                type="submit"
                disabled={isLoading || uploadLoading}
              >
                {isLoading ? "Saving..." : "Add Payment"}
              </Button>
            </Form>
          </CardBody>
        </Card>
      )}

      <Card className="mt-1">
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Payment History</CardTitle>
        </CardHeader>
        <CardBody className="pt-2">
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Cheque No.</th>
                <th>Proof</th>
                <th>Remaining After</th>
                <th>Remark</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {installments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                installments.map((inst: any) => (
                  <tr key={inst._id}>
                    <td>{inst.installmentNo}</td>
                    <td className={inst.isReversal ? "text-danger" : ""}>
                      {formatAmount(inst.amountPaid)}
                    </td>
                    <td className="text-capitalize">{inst.paymentType}</td>
                    <td>{inst.chequeNumber || "-"}</td>
                    <td>
                      {inst.paymentProof ? (
                        <a
                          href={inst.paymentProof}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{formatAmount(inst.remainingAfterPayment)}</td>
                    <td>{inst.remark || "-"}</td>
                    <td>
                      {inst.createdAt
                        ? new Date(inst.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal
        isOpen={cancelModal}
        toggle={() => setCancelModal(!cancelModal)}
        centered
      >
        <ModalHeader toggle={() => setCancelModal(!cancelModal)}>
          Cancel Booking
        </ModalHeader>
        <Form onSubmit={cancelFormik.handleSubmit}>
          <ModalBody>
            <p className="text-muted">
              Amount paid so far: <strong>{formatAmount(sale?.totalPaid)}</strong>
            </p>

            <div className="mb-1">
              <Label className="form-label">
                Reason <span className="text-danger">*</span>
              </Label>
              <Input
                type="textarea"
                name="reason"
                rows="2"
                value={cancelFormik.values.reason}
                onChange={cancelFormik.handleChange}
                onBlur={cancelFormik.handleBlur}
                invalid={
                  !!(
                    cancelFormik.touched.reason && cancelFormik.errors.reason
                  )
                }
              />
              <FormFeedback>{cancelFormik.errors.reason}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label">
                Refund Amount <span className="text-danger">*</span>
              </Label>
              <Input
                type="number"
                name="refundAmount"
                value={cancelFormik.values.refundAmount}
                onChange={cancelFormik.handleChange}
                onBlur={cancelFormik.handleBlur}
                invalid={
                  !!(
                    cancelFormik.touched.refundAmount &&
                    cancelFormik.errors.refundAmount
                  )
                }
              />
              <FormFeedback>{cancelFormik.errors.refundAmount}</FormFeedback>
            </div>

            <div className="mb-1">
              <Label className="form-label">Refund Payment Type</Label>
              <Input
                type="select"
                name="refundPaymentType"
                value={cancelFormik.values.refundPaymentType}
                onChange={cancelFormik.handleChange}
              >
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="online">Online</option>
              </Input>
            </div>

            {cancelFormik.values.refundPaymentType === "cheque" && (
              <div className="mb-1">
                <Label className="form-label">
                  Cheque Number <span className="text-danger">*</span>
                </Label>
                <Input
                  name="refundChequeNumber"
                  value={cancelFormik.values.refundChequeNumber}
                  onChange={cancelFormik.handleChange}
                  onBlur={cancelFormik.handleBlur}
                  invalid={
                    !!(
                      cancelFormik.touched.refundChequeNumber &&
                      cancelFormik.errors.refundChequeNumber
                    )
                  }
                />
                <FormFeedback>
                  {cancelFormik.errors.refundChequeNumber}
                </FormFeedback>
              </div>
            )}

            <div className="mb-1">
              <Label className="form-label">Refund Receipt Proof</Label>
              <Input type="file" onChange={handleRefundProofUpload} />
              {cancelFormik.values.refundProof && (
                <small className="text-success d-block mt-50">
                  Receipt uploaded
                </small>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => setCancelModal(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              color="danger"
              disabled={cancelLoading || refundUploadLoading}
            >
              {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default ViewBooking;
