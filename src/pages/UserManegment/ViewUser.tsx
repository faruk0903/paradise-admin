import { useLocation } from "react-router-dom";
import { Card, CardBody, Input, Label } from "reactstrap";
import { GetUserByIdApi } from "../../api/user/user";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuthStore } from "../../store/auth";

const ViewUser = () => {
  const { state } = useLocation();
  const { setData, data } = useAuthStore();
  // console.log(state.id, "userId");

  const {
  
  } = useQuery(["GetUserByIdApi", state.id], () => GetUserByIdApi(state.id), {
    onSuccess: (data) => {
      // Implement your logic here when the API call is successful
      console.log("Data loaded successfully:", data);
      if (data.status) {
        console.log(data, "data");
        setData(data?.data);
      }
    },
  });
  console.log(data?.data?.dob, "data");

  // const { mutate } = useMutation(GetUserByIdApi, {
  //   onSuccess: (data: any) => {
  //     if (data?.status) {
  //       // setShowOTP(data.data);
  //       // UseToast(data?.message);
  //       // console.log(data, "dfgfdgfd");
  //       setData(data?.data)
  //       // UseToast(data?.message);
  //       // navigate("/");
  //     }
  //   },
  //   onError: (data: any) => {
  //     UseToast(data, "error");
  //     // console.log(data, "useToast");
  //   },
  // });

  // useEffect(() => {
  //   mutate({
  //     id: state?.id
  //   });
  // }, [])

  // console.log(data, "usersss")

  const formattedDob = data?.dob
    ? format(new Date(data?.dob), "dd/MM/yyyy")
    : "";

  return (
    <div>
      {" "}
      <Card>
        <CardBody>
          <h2>User Data</h2>
          <div className="w-full flex flex-col items-center justify-center gap-10">
            <div className="user-avatar-section">
              <div className="  flex-column">
                {/* {renderUserImg()} */}
                <img
                  height="110"
                  width="110"
                  alt="user-avatar"
                  src={data?.profilePicture}
                  className="img-fluid rounded mt-3 mb-2"
                />
              </div>
            </div>

            <div className="info-container">
              <ul className="list-unstyled">
                <div className="grid  grid-cols-2 gap-2 ">
                  <li className="mb-75">
                    <div className="mb-1">
                      <Label className="fw-bolder me-25 " for="first_name">
                        First Name
                      </Label>
                      <Input
                        value={data?.firstName}
                        type="text"
                        id="first_name"
                        placeholder="john@example.com"
                        disabled={true}
                      />
                    </div>
                  </li>

                  <li className="mb-75">
                    <div className="mb-1">
                      <Label className="fw-bolder me-25 " for="lastName">
                        Last Name
                      </Label>
                      <Input
                        value={data?.lastName}
                        type="text"
                        id="lastName"
                        placeholder="Last Name"
                        disabled={true}
                      />
                    </div>
                  </li>

                  <li className="mb-75">
                    <div className="mb-1">
                      <Label className="fw-bolder me-25 " for="email">
                        Email
                      </Label>
                      <Input
                        value={data?.email}
                        type="email"
                        id="email"
                        placeholder="Email"
                        disabled={true}
                      />
                    </div>
                  </li>

                  <li className="mb-75">
                    <div className="mb-1">
                      <Label className="fw-bolder me-25 " for="phoneNumber">
                        Phone Number
                      </Label>
                      <Input
                        value={data?.phoneNumber}
                        type="text"
                        id="phoneNumber"
                        placeholder="Last Name"
                        disabled={true}
                      />
                    </div>
                  </li>
                  <li className="mb-75">
                    <div className="mb-1">
                      <Label className="fw-bolder me-25 " for="dob">
                        Date Of Birth
                      </Label>
                      <Input
                        value={formattedDob}
                        type="text"
                        id="dob"
                        placeholder="Last Name"
                        disabled={true}
                      />
                    </div>
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ViewUser;
