import { useMutation, useQuery } from "@tanstack/react-query";
import DataTableAdvSearch from "../../components/TableAdvSearch";
import { GetUsersApi, StatusUserApi, TrashUserApi } from "../../api/user/user";
import UseToast from "../../utils/useToast";
import BreadCrumbs from "../../components/breadcrumbs";
import { useEffect, useState } from "react";

const Usermanegment = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data: userData, refetch } = useQuery<any>(
    ["GetUsersApi", currentPage, rowsPerPage],
    () => GetUsersApi(currentPage + 1, rowsPerPage),
    {
      onSuccess: (data) => {
        if (data?.status) {
          console.log("Data loaded successfully:", data);
        }
      },
      onError: (error: any) => {
        UseToast(error, "error");
      },
    }
  );

  const { mutate } = useMutation(TrashUserApi, {
    onSuccess: (data: any) => {
      refetch();
      if (data?.status) {
        console.log(data, "dfgfdgfd");
        UseToast(data?.message);
      }
    },
    onError: (data: any) => {
      UseToast(data, "error");
      console.log(data, "Fgfg");
    },
  });

  const HandleDelete = (id: any) => {
    mutate(id);
    console.log("Dcd", id);
  };
  const { mutate: statusData } = useMutation(StatusUserApi, {
    onSuccess: (data: any) => {
      refetch();
      if (data?.status) {
        console.log(data, "dfgfdgfd");
        UseToast(data?.message);
      }
    },
    onError: (data: any) => {
      UseToast(data, "error");
      console.log(data, "Fgfg");
    },
  });
  const HandleStatus = (id: any, status: any) => {
    console.log(id, status);
    const data = {
      id: id,
      status: status,
    };
    statusData(data);
  };
  const totalDatas = userData?.totalData;
  const handlePagination = (page: any) => setCurrentPage(page.selected);
  const handleRowsPerPageChange = (e: any) => {
    setCurrentPage(1);
    setRowsPerPage(parseInt(e.target.value));
  };
  useEffect(() => {
    refetch();
  }, [rowsPerPage, currentPage]);
  return (
    <div className="">
      <div className="p-2">
        <BreadCrumbs
          title="User Mangement"
          data={[{ title: "User Mangement" }]}
        />
      </div>

      <DataTableAdvSearch
        data={userData?.data}
        TableTitle={"Users List"}
        EditRout={"/usermanegment/edit"}
        ViewRout={"/usermanegment/view"}
        IsAddButton={"false"}
        AddRout={""}
        DeleteFn={HandleDelete}
        StatusFn={HandleStatus}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        handlePagination={handlePagination}
        handleRowsPerPageChange={handleRowsPerPageChange}
        TotalData={totalDatas}
      />
    </div>
  );
};

export default Usermanegment;
