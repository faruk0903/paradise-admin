// ** React Imports
import { Link, useNavigate } from "react-router-dom";

// ** Custom Components
import Avatar from "../avatar";

// ** Third Party Components
import { User, Settings, Power } from "react-feather";

// ** Reactstrap Imports
import {
  UncontrolledDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
} from "reactstrap";

// ** Default Avatar Image
// import defaultAvatar from "@src/assets/images/portrait/small/avatar-s-11.jpg";
import defaultAvatar from "../../assets/images/portrait/small/avatar-s-11.jpg";
import { useAuthStore } from "../../store/auth";
import { useMutation } from "@tanstack/react-query";
import { LogOutAPI } from "../../api/auth/auth";
import UseToast from "../../utils/useToast";

const UserDropdown = () => {
  const { removeAll, user } = useAuthStore();
  const navigate = useNavigate();

  const { mutate } = useMutation(LogOutAPI, {
    onSuccess: (data: any) => {
      if (data?.status) {
        console.log(data, "dfgfdgfd");
        UseToast(data.message, "success");
        removeAll();
        navigate("/sign-in");
      }
    },
    onError: (data: any) => {
      UseToast(data, "error");
    },
  });

  const HandleLogout = () => {
    mutate("");
  };

  return (
    <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
      <DropdownToggle
        href="/"
        tag="a"
        className="nav-link dropdown-user-link"
        onClick={(e) => e.preventDefault()}
      >
        <div className="user-nav d-sm-flex d-none">
          <span className="user-name fw-bold">
            {user?.first_name
              ? `${user?.first_name} ${user?.last_name} `
              : "John Doe"}
          </span>
          <span className="user-status">Admin</span>
        </div>
        <Avatar
          img={
            user?.profile_image
              ? `${import.meta.env.VITE_IMAGE_BASE_URL}${user.profile_image}`
              : defaultAvatar
          }
          imgClassName="h-12 w-12 object-cover"
          imgHeight="40"
          imgWidth="40"
          status="online"
        />
      </DropdownToggle>
      <DropdownMenu end>
        <DropdownItem tag={Link} to="/profile" className="">
          <User size={14} className="me-75" />
          <span className="align-middle">Profile</span>
        </DropdownItem>

        {/* <DropdownItem divider /> */}
        <DropdownItem
          tag={Link}
          to="/pages/"
          onClick={(e) => e.preventDefault()}
        >
          <Settings size={14} className="me-75" />
          <span className="align-middle">Settings</span>
        </DropdownItem>

        <DropdownItem tag={"button"} onClick={HandleLogout} className="w-full">
          <Power size={14} className="me-75" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

export default UserDropdown;
