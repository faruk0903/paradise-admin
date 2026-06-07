import { toast } from "react-toastify";

const UseToast = (
  message: string | null | undefined,
  type: "error" | "warning" | "success" = "success"
) => {
  toast[type](message, {
    position: "top-right",
    theme: "colored",
    style: {
      borderRadius: 20,
      backgroundColor:
        type === "success" ? "#FF385C" : type === "error" ? "#af180d" : "",
    },
    autoClose: 5000,
    hideProgressBar: false,
    closeButton: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export default UseToast;
