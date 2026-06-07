import React, { Fragment } from "react";

import {
  Label,
  Input,
  Card,
  Button,
  Col,
  Row,
  CardBody,
  Form,
} from "reactstrap";
import UseToast from "../../utils/useToast";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import BreadCrumbs from "../../components/breadcrumbs";
import * as Yup from "yup";
import { addSiteApi } from "../../api/site";

const AddSite: React.FC = () => {
  const navigate = useNavigate();

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: {
        name: "",
        location: "",
        description: "",
      },
      validationSchema: Yup.object().shape({
        name: Yup.string().required("Site Name is required"),
      }),
      onSubmit: (value) => {
        console.log("hedddkJ");
        const data = {
          siteName: value.name,
          location: value.location,
        };

        mutate(data);
      },
    });
  const { mutate } = useMutation(addSiteApi, {
    onSuccess: (data: any) => {
      if (data?.status) {
        // setShowOTP(data.data);
        // UseToast(data?.message);
        console.log(data, "dfgfdgfd");
        UseToast(data?.message);

        navigate("/siteList");
      }
    },
    onError: (data: any) => {
      UseToast(data, "error");
    },
  });

  return (
    <Fragment>
      <div className="p-2">
        <BreadCrumbs
          title="Add Site"
          data={[{ title: "Site Management" }, { title: "Add Site" }]}
        />
      </div>
      <Card>
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="name">
                  Site Name <span className="text-danger">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Site Name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}

                  // defaultValue={data.email}
                />{" "}
                {touched.name && errors.name ? (
                  <div className="text-red-600  text-[12px] ">
                    {errors.name}
                  </div>
                ) : null}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="name">
                  Location
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}

                  // defaultValue={data.email}
                />{" "}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="desc">
                  Description
                </Label>
                <Input
                  type="textarea"
                  name="description"
                  id="desc"
                  rows="2"
                  placeholder="Description"
                  className={`${
                    errors.description && touched.description ? "error" : ""
                  } w-full rounded-md focus:ring-0`}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Col>
              <Col className="mt-2" sm="12">
                <Button type="submit" className="me-1" color="primary">
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default AddSite;
