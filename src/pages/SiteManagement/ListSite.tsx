import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { Card } from "reactstrap";
import {
  StatusCategoryApi,
} from "../../api/listingManage/placeCategory";

import DataTableAdvSearch from "../../components/TableAdvSearch";
import UseToast from "../../utils/useToast";
import BreadCrumbs from "../../components/breadcrumbs";
import { GetAllSiteApi } from "../../api/site";

const ListSite = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: SiteData, refetch } = useQuery<any>(
    ["GetUsersApi", currentPage, rowsPerPage],
    () => GetAllSiteApi(currentPage + 1, rowsPerPage, searchTerm),
    {
      onSuccess: () => {},
    }
  );


  const { mutate: statusData } = useMutation(StatusCategoryApi, {
    onSuccess: (data: any) => {
      refetch();
      if (data?.status) {
        UseToast(data?.message);
      }
    },
    onError: (data: any) => {
      UseToast(data, "error");
    },
  });
  const HandleStatus = (id: any, status: any) => {
    const data = {
      id: id,
      status: status,
    };
    statusData(data);
  };
  const totalDatas = SiteData?.totalData;
  const handlePagination = (page: any) => setCurrentPage(page.selected);
  const handleRowsPerPageChange = (e: any) => {
    setCurrentPage(0);
    setRowsPerPage(parseInt(e.target.value));
  };
  useEffect(() => {
    refetch();
  }, [rowsPerPage, currentPage, searchTerm]);
  const HandleSearch = (e: any) => {
    setCurrentPage(0);
    setSearchTerm(e.target.value);
  };
  return (
    <Card>
      <div className="p-2">
        <BreadCrumbs title="Site List" data={[{ title: "Site List" }]} />
      </div>

      <DataTableAdvSearch
        data={SiteData?.data}
        TableTitle={"Site List"}
        EditRout={"/siteList/edit"}
        ViewRout={"/siteList/view"}
        IsAddButton={"true"}
        AddRout={"/siteList/addsite"}
        StatusFn={HandleStatus}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        SearchFn={HandleSearch}
        handlePagination={handlePagination}
        handleRowsPerPageChange={handleRowsPerPageChange}
        TotalData={totalDatas}
      />
    </Card>
  );
};

export default ListSite;
