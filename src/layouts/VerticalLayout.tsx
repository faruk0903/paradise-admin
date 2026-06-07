// ** React Imports
import { Outlet } from "react-router-dom";

// ** Core Layout Import
// !Do not remove the Layout import
// import Layout from "@layouts/VerticalLayout";
import Layout from "../components/SideBar";

// ** Menu Items Array
// import navigation from "@src/navigation/vertical";
// import navigation from "../navigation/vertical/index";

const VerticalLayout: React.FC<any> = (props) => {
  return (
    // <div className="h-screen w-screen bg-black">Home</div>
    <Layout menuData={props.navigation} {...props}>
      <Outlet />
    </Layout>
  );
};

export default VerticalLayout;
