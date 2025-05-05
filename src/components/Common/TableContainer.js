import React, { Fragment, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useFilters,
  useExpanded,
  usePagination,
} from "react-table";
import { Table, Row, Col, Button, Input, Label } from "reactstrap";
import { Filter, DefaultColumnFilter } from "./filters";
import SkeletonLoader from "./SkeletonLoader";
import '../../assets/scss/_custom.scss'

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
  }, 200);
  const customStyles = {
    control: provided => ({
      ...provided,
      minHeight: "27px",
      height: "27px",
      fontSize: "0.875rem",
      padding: "0.25rem 0.5rem",
    }),

    valueContainer: provided => ({
      ...provided,
      padding: "0 0.5rem",
    }),

    input: provided => ({
      ...provided,
      margin: "0",
      padding: "0",
    }),

    indicatorSeparator: provided => ({
      ...provided,
      display: "none",
    }),

    dropdownIndicator: provided => ({
      ...provided,
      padding: "0",
    }),
  };

  return (
    <>
      <Col sm={4}>
        <div className="search-box me-2 mb-2 d-inline-block">
          <div className="position-relative">
            <label htmlFor="search-bar-0" className="search-label">
              <span id="search-bar-0-label" className="sr-only">
                Search this table
              </span>
              <input
                onChange={e => {
                  setValue(e.target.value);
                  onChange(e.target.value);
                }}
                id="search-bar-0"
                type="text"
                className="form-control"
                placeholder={`${count} records...`}
                value={value || ""}
              />
            </label>
            <i className="bx bx-search-alt search-icon"></i>
          </div>
        </div>
      </Col>
    </>
  );
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isApprovalRequest,
  isAddOptions,
  isAddUserList,
  handleClicks,
  handlePOClick,
  handleRFQClick,
  handleSalesOrderClick,
  handleQualityCheck,
  handleInvoice,
  handleApproveClick,
  handleGateEntryClick,
  VehicalValidation,
  PoValidation,
  setSelectvehicaltype,
  handlevehicaltypeChange,
  handlePoStatusChange,
  createSet,
  showCreateSet,
  showPOButton,
  showPOButtonQuotation,
  showRFQButton,
  showSalesOrderButton,
  showQualityCheck,
  showInvoice,
  showGateEntryButton,
  selectvehicaltype,
  selectPoStatus,
  optionvehicalType,
  optionPoStatus,
  handleASNClick,
  handleGRNClick,
  showASNButton,
  showGRNButton,
  handleUserClick,
  handleCustomerClick,
  selectedRows,
  selectedRowsPO,
  isAddCustList,
  customPageSize,
  className,
  customPageSizeOptions,
  addButtonLabel,
  addGateButtonLabel,
  showVechicalNoButton,
  showPoStatus,
  showApproveButton,
  buttonSizes,
  handlevehicaltype,
  isLoading = false,
}) => {
  const [pageNo, setPageNo] = useState(0);
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: pageNo,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination
  );

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : "";
  };

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value));
  };


  const onChangeInInput = event => {
    const page = event.target.value ? Number(event.target.value) - 1 : 0;
    gotoPage(page);
  };

  const approveRejectButtonSize = selectedRows?.length > 0 ? "3" : "8";
  const addRfqButtonSize = selectedRows?.length > 0 ? "2" : "4";

  return (
    <Fragment>
      <Row className="mb-2">
        {/* <Col md={customPageSizeOptions ? 2 : 1}>
          <select
            className="form-select"
            value={pageSize}
            onChange={onChangeInSelect}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Col> */}
        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        )}
        {isApprovalRequest && (
          <Col sm={"3"}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={() => window.open("/approval_request", "_blank")}
              >
                Approval Request
              </Button>
            </div>
          </Col>
        )}

        {showPoStatus && (
          <>
            <Col md="3">
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Label
                    htmlFor="formrow-state-Input"
                    style={{ marginRight: "0.5rem" }}
                  >
                    PO Status
                  </Label>
                  {PoValidation && (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "1.25rem",
                        marginLeft: "0.5rem",
                      }}
                    >
                      *
                    </div>
                  )}
                </div>
                <select
                  value={selectPoStatus}
                  onChange={handlePoStatusChange}
                  className="form-control"
                >
                  <option value="1">Approved</option>
                  <option value="3">Closed</option>
                  <option value="0">Open</option>
                  <option value="2">Rejected</option>
                </select>
              </div>
            </Col>
          </>
        )}

        {showASNButton && selectedRows?.length > 0 && (
          <Col sm={buttonSizes?.ASN || "8"}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleASNClick}
              >
                Create ASN
              </Button>
            </div>
          </Col>
        )}
        {showGRNButton &&
          selectedRows?.length > 0 && ( // Conditionally render ASN button based on showGRNButton prop
            <Col sm={buttonSizes?.GRN || "4"}>
              <div className="text-sm-end">
                <Button
                  type="button"
                  className="btn-custom-theme btn-rounded mb-2 me-2"
                  onClick={handleGRNClick}
                >
                  Create GRN
                </Button>
              </div>
            </Col>
          )}

        {showApproveButton && selectedRows?.length > 0 && (
          <Col sm={approveRejectButtonSize}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleApproveClick}
              >
                Approve/Reject
              </Button>
            </div>
          </Col>
        )}
        {showPOButton && selectedRowsPO.length > 0 && (
          <Col sm={buttonSizes?.addButtonLabel}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handlePOClick}
              >
                Create PO
              </Button>
            </div>
          </Col>
        )}
        {showPOButtonQuotation && selectedRowsPO.length > 0 && (
          <Col sm={buttonSizes?.addButtonLabel}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handlePOClick}
              >
                Create PO Quotation
              </Button>
            </div>
          </Col>
        )}
        {showRFQButton && selectedRows?.length > 0 && (
          <Col sm={buttonSizes?.addButtonLabel}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleRFQClick}
              >
                Create RFQ
              </Button>
            </div>
          </Col>
        )}
         {showSalesOrderButton && ( // Conditionally render Sales Order button based on showSalesOrderButton prop */}
          <Col sm={buttonSizes?.salesOrder || "8"}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleSalesOrderClick}
              >
                Add Sales Order
              </Button>
            </div>
          </Col>
        )}
        {showVechicalNoButton && (
          <>
            <Col md="3" className="mb-2">
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Label htmlFor="formrow-state-Input" style={{ marginRight: "0.5rem" }}>
                    Select Vehicle No
                  </Label>
                  {VehicalValidation && (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "1.25rem",
                        marginLeft: "0.5rem",
                      }}
                    >
                      *
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Select
                    value={selectvehicaltype}
                    options={optionvehicalType}
                    onChange={handlevehicaltypeChange}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        width: "250px", // Increase the width of the dropdown
                      }),
                    }}
                  />
                  <button
                    onClick={() => setSelectvehicaltype(null)}
                    style={{
                      background: "#556ee6",
                      color: "#fff",
                      border: "none",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </Col>
          </>
        )}
        {/* {showVechicalNoButton && (
          <>
            <Col md="3" className="mb-2">
              <div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Label
                    htmlFor="formrow-state-Input"
                    style={{ marginRight: "0.5rem" }}
                  >
                    Select Vehical No
                  </Label>
                  {VehicalValidation && (
                    <div
                      style={{
                        color: "#f46a6a",
                        fontSize: "1.25rem",
                        marginLeft: "0.5rem",
                      }}
                    >
                      *
                    </div>
                  )}
                </div>
                <Select
                  value={selectvehicaltype}
                  options={optionvehicalType}
                  onChange={handlevehicaltypeChange}
                />
              </div>
            </Col>
          </>
        )} */}
        {showQualityCheck && selectedRows?.length > 0 && (
          <Col sm={buttonSizes?.QC}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleQualityCheck}
              >
                Quality Check
              </Button>
            </div>
          </Col>
        )}
        {showInvoice && selectedRows?.length > 0 && (
          <Col sm={buttonSizes?.Invoice}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleInvoice}
              >
                Create Invoice
              </Button>
            </div>
          </Col>
        )}

        {showGateEntryButton &&
          selectvehicaltype &&
          selectedRows?.length > 0 && (
            <>
              <Col sm={buttonSizes?.addButtonLabel}>
                <div className="text-sm-end">
                  <Button
                    type="button"
                    className="btn-custom-theme btn-rounded mb-2 me-2"
                    onClick={handleGateEntryClick}
                  >
                    {addGateButtonLabel}
                  </Button>
                </div>
              </Col>
            </>
          )}
        {showCreateSet && selectedRows?.length > 0 && (
          <Col sm={buttonSizes?.createSet}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={createSet}
              >
                Create Set
              </Button>
            </div>
          </Col>
        )}
        {isAddOptions && addButtonLabel && (
          <Col sm={addRfqButtonSize}>
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleClicks}
              >
                {addButtonLabel}
              </Button>
            </div>
          </Col>
        )}

        {isAddUserList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7">
            <div className="text-sm-end">
              <Button
                type="button"
                className="btn-custom-theme btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive react-table">
        <Table bordered hover {...getTableProps()} className={className}>
          <thead className="table-light table-nowrap">
            {headerGroups.map(headerGroup => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th key={column.id}>
                    <div className="mb-2" {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {generateSortingIndicator(column)}
                    </div>
                    <Filter column={column} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody {...getTableBodyProps()}>
            {isLoading ? (
              Array.from({ length: customPageSize || 10 }).map((_, index) => (
                <tr key={`skeleton-${index}`}>
                  {columns.map((column, colIndex) => (
                    <td key={`skeleton-cell-${index}-${colIndex}`}>
                      <SkeletonLoader />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              page.map(row => {
                prepareRow(row);
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {row.cells.map(cell => {
                        return (
                          <td key={cell.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  </Fragment>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      <Row className="justify-content-md-end justify-content-center align-items-center">
        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button
              className="btn-custom-theme me-2"
              onClick={() => {
                gotoPage(0);
                setPageNo(0);
              }}
              disabled={!canPreviousPage}
            >
              {"<<"}
            </Button>
            <Button
              className="btn-custom-theme me-2" 
              onClick={() => {
                previousPage();
                setPageNo(pageIndex - 1);
              }}
              disabled={!canPreviousPage}
            >
              {"<"}
            </Button>
          </div>
        </Col>
        <Col className="col-md-auto d-none d-md-block">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </Col>
        <Col className="col-md-auto">
          <Input
            type="number"
            min={1}
            style={{ width: 70 }}
            max={pageOptions.length}
            defaultValue={pageIndex + 1}
            onChange={onChangeInInput}
          />
        </Col>

        <Col className="col-md-auto">
          <div className="d-flex gap-1">
            <Button 
            className="btn-custom-theme me-2" 
            onClick={() => {
              nextPage();
              setPageNo(pageIndex + 1);
            }} disabled={!canNextPage}>
              {">"}
            </Button>
            <Button
              className="btn-custom-theme me-2"
              onClick={() => {
                gotoPage(pageCount - 1);
                setPageNo(pageCount - 1);
              }} disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
  selectedRows: PropTypes.array,
  selectedRowsPO: PropTypes.array,
  selectvehicaltype: PropTypes.array,
  selectPoStatus: PropTypes.array,
  optionvehicalType: PropTypes.array,
  optionPoStatus: PropTypes.array,
  VehicalValidation: PropTypes.bool,
  PoValidation: PropTypes.bool,
  handlevehicaltypeChange: PropTypes.func,
  handlePoStatusChange: PropTypes.func,
  handlePOClick: PropTypes.func,
  handleRFQClick: PropTypes.func,
  handleSalesOrderClick: PropTypes.func,
  handleQualityCheck: PropTypes.func,
  handleInvoice: PropTypes.func,
  handleGateEntryClick: PropTypes.func,
  createSet: PropTypes.func,
  handleApproveClick: PropTypes.func,
  showPOButton: PropTypes.bool,
  showPOButtonQuotation: PropTypes.bool,
  showRFQButton: PropTypes.bool,
  showSalesOrderButton: PropTypes.bool,
  showQualityCheck: PropTypes.bool,
  showInvoice: PropTypes.bool,
  showCreateSet: PropTypes.bool,
  showASNButton: PropTypes.bool,
  showGateEntryButton: PropTypes.bool,
  showGRNButton: PropTypes.bool,
  handleASNClick: PropTypes.func,
  handleGRNClick: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default TableContainer;
