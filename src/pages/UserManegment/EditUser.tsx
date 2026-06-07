import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button, Card, CardBody, Form, Input, Label } from "reactstrap";
import { GetUserByIdApi, UpdateUser } from "../../api/user/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import UseToast from "../../utils/useToast";

const EditUser = () => {
  const { state } = useLocation();
  console.log(state?.id, "state");

  const [userData, setUserData] = useState(null);
  console.log(userData, "hello");


 

  



  // Fetch user data and store it in the state
  const {  } = useQuery(["data"], () => GetUserByIdApi(state.id), {
    onSuccess: (data) => {
      if (data?.status) {
        setUserData(data?.data);
        setFieldValue?.("firstName", data?.data?.firstName);
        setFieldValue?.("lastName", data?.data?.lastName);
        setFieldValue?.("email", data?.data?.email);
        setFieldValue?.("phoneNumber", data?.data?.phoneNumber);
      }
    },
  });

  const { mutate } = useMutation(UpdateUser, {
    onSuccess: (response: any) => {
      UseToast(response, "success");
    },
    onError: (err: any) => {
      UseToast(err, "error");
    },
  });

  const {
    values,
    // errors,
    // touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    
    },
    onSubmit: (value) => {
      console.log("hedddkJ");
      console.log(value, "form");
      const finalData = { ...value, id: state.id };
      mutate(finalData);
    },
  });

  // Function to format the date


  return (
    <div>
      <div>
        {" "}
        <Form onSubmit={handleSubmit}>
          <Card>
            <CardBody>
              <div className="w-full flex flex-col items-center justify-center gap-10">
            
                <div className="info-container">
                  <ul className="list-unstyled">
                    <div className="grid  grid-cols-2 gap-2 ">
                      <li className="mb-75">
                        <div className="mb-1">
                          <Label className="fw-bolder me-25 " for="firstName">
                            First Name
                          </Label>
                          <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.firstName}
                            type="text"
                            id="firstName"
                            placeholder="john@example.com"
                          />
                        </div>
                      </li>

                      <li className="mb-75">
                        <div className="mb-1">
                          <Label className="fw-bolder me-25 " for="lastName">
                            Last Name
                          </Label>
                          <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.lastName}
                            type="text"
                            id="lastName"
                            placeholder="Last Name"
                          />
                        </div>
                      </li>

                      <li className="mb-75">
                        <div className="mb-1">
                          <Label className="fw-bolder me-25 " for="email">
                            Email
                          </Label>
                          <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.email}
                            type="email"
                            id="email"
                            placeholder="Email"
                          />
                        </div>
                      </li>
                      <li className="mb-75">
                        <div className="mb-1">
                          <Label className="fw-bolder me-25 " for="phoneNumber">
                            Phone Number
                          </Label>
                          <Input
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values?.phoneNumber}
                            type="text"
                            id="phoneNumber"
                            placeholder="Last Name"
                          />
                        </div>
                      </li>
                    
                    </div>
                  </ul>
                </div>
              </div>

              <div className="d-flex justify-content-center pt-2">
                <Button color="primary" type="submit">
                  Submit
                </Button>
              </div>
            </CardBody>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default EditUser;
