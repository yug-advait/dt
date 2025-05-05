import React, { useEffect, useMemo, useState } from "react";
import {
    Row,
    Col,
    UncontrolledTooltip,
    Button,
    Modal,
    Form,
    Label,
    Input,
    Alert
} from "reactstrap";
import { Link } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
    GET_SALES_DISTRICT_REQUEST,
    ADD_SALES_DISTRICT_REQUEST,
    UPDATE_SALES_DISTRICT_REQUEST,
    DELETE_SALES_DISTRICT_REQUEST,
} from "../../../store/salesDistricts/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const SalesDistricts = () => {
    const [modal, setModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [salesDistrictRow, setSalesDistrictsRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        sales_district_short_code: "",
        sales_district_description: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { listSalesDistricts, salesDistricts, addSalesDistricts, updateSalesDistricts, deleteSalesDistricts, error } = useSelector(
        state => state.salesDistricts || {}
    );

    const { updateCommon } = useSelector(state => state.commons);

    useEffect(() => {
        dispatch({
            type: GET_SALES_DISTRICT_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listSalesDistricts) {
            setLoading(false)
        }
        if (addSalesDistricts) {
            setToastMessage("Sales Districts Added Successfully");
            dispatch({
                type: GET_SALES_DISTRICT_REQUEST,
            });
            setToast(true);
        }
        if (updateSalesDistricts) {
            setToastMessage("Sales Districts Updated Successfully");
            dispatch({
                type: GET_SALES_DISTRICT_REQUEST,
            });
            setToast(true);
        }
        if (deleteSalesDistricts) {
            setToastMessage("Sales Districts Deleted Successfully");
            dispatch({
                type: GET_SALES_DISTRICT_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Sales Districts Status Updated Successfully");
            dispatch({
                type: UPDATE_STATUS_RESET,
            });
            dispatch({
                type: GET_SALES_DISTRICT_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listSalesDistricts, addSalesDistricts, updateSalesDistricts, deleteSalesDistricts, updateCommon, toast]);

    const handleClicks = async () => {
        setFormData({
            sales_district_short_code: "",
            sales_district_description: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setSalesDistrictsRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_SALES_DISTRICT_REQUEST,
                payload: salesDistrictRow.id
            });

            setDeleteModal(false);
        }
        catch (error) {
            console.error("Error in deleting data : ", error);
        }
    }

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'sales_district_short_code' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
              ...formErrors,
              sales_district_short_code: "Sales Office Code cannot be more than 4 characters"
            });
          } else {
            setFormErrors({
              ...formErrors,
              sales_district_short_code: ""
            });
          }
        if (name === 'sales_district_description' && value.length > 150) {
            newValue = value.slice(0, 150);
            setFormErrors({
              ...formErrors,
              sales_district_description: "Sales Districts Description cannot be more than 150 characters"
            });
          } else {
            setFormErrors({
              ...formErrors,
              sales_district_description: ""
            });
          }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.sales_district_short_code.trim()) {
            errors.sales_district_short_code = "Sales District Short Code is required.";
        }
        else if (formData.sales_district_short_code.length > 4) {
            errors.sales_district_short_code = "Sales District Short Code cannot be more than 4 characters"
          }
        if (!formData.sales_district_description.trim()) {
            errors.sales_district_description = "Sales Districts Description is required.";
        }
        else if (formData.sales_district_description.length > 150) {
            errors.sales_district_description = "Sales District Description  cannot be more than 150 characters"
          }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSaveOrEdit = async e => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        try {
            if (Edit) {
                const Id = Edit.id;
                const salesDistrictsData = {
                    formData,
                    Id
                };
                dispatch({
                    type: UPDATE_SALES_DISTRICT_REQUEST,
                    payload: salesDistrictsData
                });
            }
            else {
                const salesDistrictsData = {
                    formData
                };
                dispatch({
                    type: ADD_SALES_DISTRICT_REQUEST,
                    payload: salesDistrictsData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing Sales District : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setSalesDistrictsRow(data);
        setFormData({
            sales_district_short_code: data?.sales_district_short_code,
            sales_district_description: data?.sales_district_description,
            isactive: data?.isactive,
        });
        setModal(true);
        if (data) {
            setIsActive(data.isactive);
        }
    }

    const resetForm = () => {
        setFormErrors({})
        setErrors({});
        setEdit(null);
    }

    const columns = useMemo(() => [
        {
            Header: "Short Code",
            accessor: "sales_district_short_code"
        },
        {
            Header: "Description",
            accessor: "sales_district_description"
        },
        {
            Header: "Created On",
            accessor: "createdon",
            Cell: ({ value }) => {
                const formattedDate = moment(value).format('DD/MM/YYYY');
                return <div>{formattedDate}</div>
            }
        },
        {
            Header: "Status",
            accessor: "isactive",
            Cell: cellProps => {
                return (
                    <>
                        <div className="form-check form-switch mb-3" dir="ltr">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id=""
                                checked={cellProps.row.original.isactive}
                                onClick={() => {
                                    dispatch({
                                        type: STATUS_REQUEST,
                                        payload: {
                                            name: "sales_district",
                                            isactive: !cellProps.row.original.isactive,
                                            id: cellProps.row.original?.id,
                                        },
                                    });
                                }} />
                        </div>
                    </>
                );
            },
        },
        {
            Header: "Actions",
            accessor: "action",
            disableFilters: true,
            Cell: cellProps => {
                return (
                    <div className="d-flex gap-3">
                        <Link
                            to="#"
                            className="text-success"
                            onClick={() => openModal(cellProps.row.original)}>
                            <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                            <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                        </Link>

                        <Link
                            to="#"
                            className="text-danger"
                            onClick={() => {
                                const data = cellProps.row.original;
                                onClickDelete(data);
                            }}>
                            <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                            <UncontrolledTooltip placement="top" target="deletetooltip">Delete</UncontrolledTooltip>
                        </Link>
                    </div>
                );
            },
        }], [status]);

    document.title = "Detergent | Sales Districts";

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">

                    {toast && (
                        <div
                            className="position-fixed top-0 end-0 p-3"
                            style={{ zIndex: "1005" }}
                        >
                            <Alert color="success" role="alert">
                                {toastMessage}
                            </Alert>
                        </div>
                    )}

                    <DeleteModal
                        show={deleteModal}
                        title1="Are you sure?"
                        title2="You won't be able to revert this!"
                        className="mdi mdi-alert-circle-outline"
                        saveTitle="Yes, delete it!"
                        onDeleteClick={handleDelete}
                        onCloseClick={() => setDeleteModal(false)}
                    />
                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Sales Districts" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={salesDistricts && salesDistricts.length > 0 ? salesDistricts : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={"Add Sales District"}
                            handleClicks={handleClicks}
                        />
                    )}
                </div>
                <Modal isOpen={modal} centered>
                    <div className="modal-header">
                        {Edit ? "Edit" : "Add"}
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setModal(false);
                            }}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Form onSubmit={handleSaveOrEdit}>
                            <Row>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Short Code</Label>
                                        <Input
                                            type="text"
                                            name="sales_district_short_code"
                                            className={`form-control ${formErrors.sales_district_short_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Sales District Short Code"
                                            value={formData?.sales_district_short_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.sales_district_short_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.sales_district_short_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="salesDistrictDescription">Description</Label>
                                    <Input
                                        type="textarea"
                                        id="salesDistrictDescription"
                                        name="sales_district_description"
                                        className={`form-control ${formErrors.sales_district_description ? "is-invalid" : ""
                                            }`}
                                        value={formData.sales_district_description}
                                        rows="3"
                                        placeholder="Please Enter Sales Districts Description"
                                        onChange={handleChange}
                                    />
                                    {formErrors.sales_district_description && (
                                        <div className="invalid-feedback">
                                            {formErrors.sales_district_description}
                                        </div>
                                    )}
                                </Col>
                                <Col md={6} className="">
                                    <div className="form-check form-switch mb-3" dir="ltr">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="customSwitchsizesm"
                                            checked={isActive}
                                            onClick={() => {
                                                setIsActive(!isActive);
                                                setFormData({
                                                    ...formData,
                                                    ['isactive']: !isActive,
                                                });
                                            }}
                                        />
                                        <label className="form-check-label" htmlFor="customSwitchsizesm">Status</label>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <Button  type="submit" className="btn-custom-theme ">
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        </React.Fragment>
    )
}

export default SalesDistricts;