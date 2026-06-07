import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import DataTable, { TableColumn } from "react-data-table-component";
import { ChevronDown, Edit, Eye } from "react-feather";
import ReactPaginate from "react-paginate";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";

import BreadCrumbs from "../../components/breadcrumbs";
import { GetAllBookingApi } from "../../api/plotSale";

const formatAmount = (value: number) =>
  `₹ ${Number(value || 0).toLocaleString("en-IN")}`;

const ListBooking = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(state?.status || "");

  const { data: BookingData, refetch } = useQuery<any>(
    ["GetAllBookingApi", currentPage, rowsPerPage, searchTerm, statusFilter],
    () => GetAllBookingApi(currentPage + 1, rowsPerPage, searchTerm, statusFilter),
    { keepPreviousData: true }
  );

  const statusTabs = [
    { key: "", label: "All Bookings" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const statusBadge: Record<string, { color: string; label: string }> = {
    active: { color: "warning", label: "Active" },
    completed: { color: "success", label: "Completed" },
    cancelled: { color: "danger", label: "Cancelled" },
  };

  const handleStatusFilter = (key: string) => {
    setCurrentPage(0);
    setStatusFilter(key);
  };

  const totalRecords = BookingData?.pagination?.totalRecords || 0;

  const handlePagination = (page: any) => setCurrentPage(page.selected);

  const handleRowsPerPageChange = (e: any) => {
    setCurrentPage(0);
    setRowsPerPage(parseInt(e.target.value));
  };

  const HandleSearch = (e: any) => {
    setCurrentPage(0);
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    refetch();
  }, [rowsPerPage, currentPage, searchTerm, statusFilter]);

  const columns: TableColumn<any>[] = [
    {
      name: "#",
      minWidth: "60px",
      cell: (_row, index) => <p>{currentPage * rowsPerPage + index + 1}</p>,
    },
    {
      name: "Site",
      minWidth: "150px",
      selector: (row) => row?.siteId?.siteName || "-",
      sortable: true,
    },
    {
      name: "Customer",
      minWidth: "150px",
      selector: (row) => row?.customerName || "-",
      sortable: true,
    },
    {
      name: "Mobile",
      minWidth: "130px",
      selector: (row) => row?.customerMobile || "-",
    },
    {
      name: "Plots",
      minWidth: "120px",
      cell: (row) => <p>{(row?.plotNumbers || []).join(", ")}</p>,
    },
    {
      name: "Sq. Yards",
      minWidth: "100px",
      selector: (row) => row?.sqYards,
    },
    {
      name: "Total",
      minWidth: "130px",
      cell: (row) => <p>{formatAmount(row?.totalAmount)}</p>,
      sortable: true,
    },
    {
      name: "Paid",
      minWidth: "130px",
      cell: (row) => (
        <p className="text-success">{formatAmount(row?.totalPaid)}</p>
      ),
    },
    {
      name: "Remaining",
      minWidth: "130px",
      cell: (row) => (
        <p className="text-danger">{formatAmount(row?.remainingAmount)}</p>
      ),
    },
    {
      name: "Status",
      minWidth: "120px",
      cell: (row) => {
        const badge = statusBadge[row?.status] || statusBadge.active;
        return <Badge color={badge.color}>{badge.label}</Badge>;
      },
    },
    {
      name: "Actions",
      minWidth: "120px",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            onClick={() =>
              navigate("/bookingList/view", { state: { id: row._id } })
            }
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() =>
              navigate("/bookingList/edit", { state: { id: row._id } })
            }
          >
            <Edit size={15} />
          </button>
        </div>
      ),
    },
  ];

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={Math.ceil(totalRecords / rowsPerPage) || 1}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName={
        "pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
      }
    />
  );

  return (
    <Card>
      <div className="p-2">
        <BreadCrumbs title="Booking List" data={[{ title: "Booking List" }]} />
      </div>

      <CardHeader className="border-bottom">
        <CardTitle tag="h4">Booking List</CardTitle>
      </CardHeader>

      <Nav tabs className="mt-1 px-1">
        {statusTabs.map((tab) => (
          <NavItem key={tab.key || "all"}>
            <NavLink
              className="cursor-pointer"
              active={statusFilter === tab.key}
              onClick={() => handleStatusFilter(tab.key)}
            >
              {tab.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <Row className="text-nowrap w-100 my-75 g-0 permission-header px-1">
        <Col xs={12} lg={4} className="d-flex align-items-center">
          <div className="d-flex align-items-center justify-content-center justify-content-lg-start pl-3">
            <label htmlFor="rows-per-page">Show</label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              style={{ width: "5rem" }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
            <label htmlFor="rows-per-page">Entries</label>
          </div>
        </Col>
        <Col xs={12} lg={8}>
          <div className="d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-0 mt-1 pl-3 ">
            <div className="d-flex align-items-center me-1">
              <label className="mb-0" htmlFor="search-booking">
                Search:
              </label>
              <Input
                type="text"
                id="search-booking"
                className="ms-50 w-100"
                placeholder="Customer, mobile, site..."
                onChange={HandleSearch}
              />
            </div>

            <Button
              onClick={() => navigate("/bookingList/add")}
              className="add-permission mt-sm-0 mt-1"
              color="primary"
            >
              Add
            </Button>
          </div>
        </Col>
      </Row>

      <div className="react-dataTable">
        <DataTable
          noHeader
          pagination
          columns={columns}
          paginationPerPage={rowsPerPage}
          className="react-dataTable pb-40"
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={BookingData?.data || []}
        />
      </div>
    </Card>
  );
};

export default ListBooking;
