import { Fragment, useEffect, useState } from "react";

import DataTable, { TableColumn } from "react-data-table-component";
import { ChevronDown, Edit, Eye, Trash } from "react-feather";
import ReactPaginate from "react-paginate";
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  Col,
  Input,
  Row,
} from "reactstrap";

// ** Styles
// import "@styles/react/libs/flatpickr/flatpickr.scss";

import { useNavigate } from "react-router-dom";
import "../assets/scss/react/libs/flatpickr/flatpickr.scss";
import { PopurlarCategoryApi } from "../api/listingManage/placeCategory";

const DataTableAdvSearch: React.FC<any> = ({
  data,
  TableTitle,
  IsAddButton,
  AddRout,
  EditRout,
  ViewRout,
  DeleteFn,
  SearchFn,
  TrashDisplay = false,
  currentPage,
  rowsPerPage,
  handlePagination,
  handleRowsPerPageChange,
  AcceptFn,
  TotalData,
  IsPrimaryFn,
}) => {
  const navigate = useNavigate();
  console.log(AcceptFn, "funnd");
  // console.log(advSearchColumns, "data");
  // ** States
  // const [currentPage, setCurrentPage] = useState(0);
  const handleSearch = (a: any) => {
    SearchFn(a);
  };
  const [columns, setColumns] = useState<TableColumn<any>[]>([]);
  // const [rowsPerPage, setRowsPerPage] = useState(10);

  // ** Function to handle Pagination
  // const handlePagination = (page: any) => setCurrentPage(page.selected);

  // ** Function to handle rows per page change
  // const handleRowsPerPageChange = (e) => {
  //   setCurrentPage(0); // Reset current page when changing rows per page
  //   setRowsPerPage(parseInt(e.target.value)); // Update rows per page
  // };

  // ** Table data to render

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={handlePagination}
      // pageCount={Math.ceil(data?.length / 10) || 1}
      pageCount={Math.ceil(TotalData / rowsPerPage) || 1}
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



  const handlePrimary = (id: string, status: any) => {
    IsPrimaryFn(id, status);
  };
  
 
  useEffect(() => {
    if (data && data.length > 0) {
      const excludedKeys = new Set([
        "sortable",
        "__v",
        "otp",
        "description",
        "trash",
        "icon",
        "bg_image",
        "updatedAt",
        "createdAt",
        "guest_id",
        "is_lock",
        "address2",
        "country",
        "trending",
        "countryCode",
        "user_id",
        "guest_id",
        "password",
        "resetPasswordExpires",
        "resetPasswordToken",
      ]);
      if (TrashDisplay) {
        excludedKeys.add("trash");
      }
      const keys = Object.keys(data[0]).filter((key) => !excludedKeys.has(key));

      const columnMap: Record<string, string> = {
        _id: "Id",
        varient: "Product Image",
        new_arrival: "New Arrival",
        trending: "Trending",
        category_id: "Category",
        name: "Name",
        image: "Image",
        items: "Items",
        is_popular: "IsPopular",
        customer_type: "Customer Type",
        waybillNumber: "Label",
        trash: "Trash",
      };

      const columnsData = keys.map((key) => {
        let displayName =
          columnMap[key] || key.charAt(0).toUpperCase() + key.slice(1);

        let column: TableColumn<any> = {
          name: displayName,
          sortable: true,
          minWidth: "200px",
          selector: (row) => row[key],
        };

        switch (displayName) {
          case "Id":
            column.cell = (_row, index) => (
              <p>{currentPage * rowsPerPage + index + 1}</p>
            );
            break;

          case "Image":
            column.cell = (row) => (
              <div>
                <img
                  className="h-40"
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${row?.image}`}
                  alt="Product"
                />
              </div>
            );
            break;

        

        
            column.cell = (row) => (
              <div
                onClick={() =>
                  PopurlarCategoryApi({
                    categoryId: row._id,
                    is_popular: row[key] === 1 ? 0 : 1,
                  })
                }
                className="form-check form-switch"
              >
                <Input
                  type="switch"
                  id="popular-switch"
                  name="popularSwitch"
                  defaultChecked={row[key] === 1}
                />
              </div>
            );
            break;
        
            column.cell = (row) =>
              row[key] === 1 ? (
                <Button
                  onClick={() => handlePrimary(row._id, row[key] === 1 ? 0 : 1)}
                  size="sm"
                  color="success"
                >
                  Primary
                </Button>
              ) : (
                <Button
                  onClick={() => handlePrimary(row._id, row[key] === 1 ? 0 : 1)}
                  size="sm"
                  color="primary"
                >
                  Set as Primary
                </Button>
              );
            break;
          case "ProfilePicture":
            column.cell = (row) =>
              row[key] ? (
                <img
                  src={row[key]}
                  className="h-12 w-12 rounded-full"
                  alt="Profile"
                />
              ) : (
                <p>-</p>
              );
            break;

          case "Category":
            column.cell = (row) => <p>{row?.category_id?.name}</p>;
            break;

         
            column.cell = (row) =>
              row?.varient ? (
                <img
                  className="h-36"
                  src={`${import.meta.env.VITE_IMAGE_BASE_URL}${
                    row?.varient[0]?.images[0]
                  }`}
                  alt="Product"
                />
              ) : (
                ""
              );
            break;
          case "Trash":
            column.cell = (row) => (
              <p>{row[key] === 1 ? "In Trash" : "Active"}</p>
            );
            break;
       
        
        }

        return column;
      });

      const buttonsColumn: TableColumn<any> = {
        name: "Actions",
        cell: (row) => (
          <div className="d-flex gap-2">
            <button
              onClick={() =>
                navigate(`${ViewRout}`, { state: { id: row._id } })
              }
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() =>
                navigate(`${EditRout}`, { state: { id: row._id } })
              }
            >
              <Edit size={15} />
            </button>
            {DeleteFn && (
              <button onClick={() => DeleteFn(row._id)}>
                <Trash size={15} />
              </button>
            )}
          </div>
        ),
      };

      setColumns([...columnsData, buttonsColumn]);
    }
  }, [data, rowsPerPage, currentPage]);

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">{TableTitle}</CardTitle>
        </CardHeader>

        <Row className="text-nowrap w-100 my-75 g-0 permission-header px-1">
          <Col xs={12} lg={4} className="d-flex align-items-center">
            {data &&
            data !== undefined &&
            data !== null &&
            data.length !== 0 ? (
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
            ) : (
              <div></div>
            )}
          </Col>
          <Col xs={12} lg={8}>
            <div className="d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-0 mt-1 pl-3 ">
              <div className="d-flex align-items-center me-1">
                <label className="mb-0" htmlFor="search-permission">
                  Search:
                </label>
                <Input
                  type="text"
                  id="search-permission"
                  className="ms-50 w-100"
                  onChange={handleSearch}
                />
              </div>

              {IsAddButton == "true" && (
                <Button
                  onClick={() => navigate(`${AddRout}`)}
                  className="add-permission mt-sm-0 mt-1"
                  color="primary"
                >
                  Add
                </Button>
              )}
            </div>
          </Col>
        </Row>

        <div className="react-dataTable">
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={100}
            className="react-dataTable pb-40"
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={data}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default DataTableAdvSearch;
