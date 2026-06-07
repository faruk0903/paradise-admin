import { Fragment } from "react";

import { EditCategoryApi } from "../../api/listingManage/placeCategory";
import { useMutation, useQuery } from "@tanstack/react-query";
import UseToast from "../../utils/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";

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
import BreadCrumbs from "../../components/breadcrumbs";
import * as Yup from "yup";
import { GetSiteApi } from "../../api/site";

const EditSite = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // const navigate = useNavigate();

  const {} = useQuery(
    ["data", state?.id], // Ensure state exists before using it
    () => GetSiteApi(state?.id), // Ensure state exists before using it
    {
      onSuccess: (data) => {
        console.log(data, "site data");
        setFieldValue("name", data?.data?.siteName);
        setFieldValue("location", data?.data?.location);
        setFieldValue("description", data?.data?.description);
      },
    }
  );

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required("Site name is required"),
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      name: "",
      location: "",
      description: "",
    },
    validationSchema,
    onSubmit: (value) => {
      const data = { ...value, id: state.id };

      mutate(data);
    },
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { mutate } = useMutation(EditCategoryApi, {
    onSuccess: (data: any) => {
      if (data?.status) {
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
          title="Edit Site"
          data={[{ title: "Site", link: "/siteList" }, { title: "Edit" }]}
        />
      </div>
      <Row className="">
        <Col className="d-flex w-full justify-content-end ">
          {" "}
          <Button
            onClick={() => navigate("/siteList")}
            className="add-permission mt-sm-0 mt-1"
            color="primary"
          >
            Back
          </Button>
        </Col>
      </Row>
      <Card className="mt-1">
        <CardBody className="py-2 my-25">
          <Form className="mt-2 pt-50" onSubmit={handleSubmit}>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Site Name"
                  className={` ${
                    errors.name && touched.name ? "error" : ""
                  } w-full rounded-md focus:ring-0`}
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  // defaultValue={data.email}
                />
                {touched.name && errors.name ? (
                  <div className="text-red-600  text-[12px] pl-3">
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
                  Update
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default EditSite;
