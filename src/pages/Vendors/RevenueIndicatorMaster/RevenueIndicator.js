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
import { Link, useLocation } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
    GET_REVENUE_INDICATORS_REQUEST,
    ADD_REVENUE_INDICATORS_REQUEST,
    UPDATE_REVENUE_INDICATORS_REQUEST,
    DELETE_REVENUE_INDICATORS_REQUEST,
} from "../../../store/revenueIndicator/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const RevenueIndicator = () => {

    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [revenueIndicatorRow, setRevenueIndicatorRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [revenueIndicatorPermission, setRevenueIndicatorPermission] = useState();
    const [formData, setFormData] = useState({
        indicator_code: "",
        indicator_description: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { listRevenueIndicator, revenueIndicators, addRevenueIndicator, updateRevenueIndicator, deleteRevenueIndicator, error } = useSelector(
        state => state.revenueIndicators || {}
    );
    const { updateCommon } = useSelector(state => state.commons);

    const location = useLocation();

    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    };

    useEffect(() => {
        const userData = getUserData();
        const revenueIndicator = location.pathname == "/vendor/revenue_indicator" ? 'vendors_revenue_indicators' : 'customers_revenue_indicators'
        var permissions = userData?.permissionList?.filter(
            permission =>
                permission.sub_menu_name === revenueIndicator
        );
        setRevenueIndicatorPermission(
            permissions.find(permission => permission.sub_menu_name === revenueIndicator)
        );
        dispatch({
            type: GET_REVENUE_INDICATORS_REQUEST,
            payload: { revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c' },
        });
    }, []);

    useEffect(() => {
        if (listRevenueIndicator) {
            setLoading(false)
        }
        if (addRevenueIndicator) {
            setToastMessage("Revenue Indicator Added Successfully");
            dispatch({
                type: GET_REVENUE_INDICATORS_REQUEST,
                payload: { revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (updateRevenueIndicator) {
            setToastMessage("Revenue Indicator Updated Successfully");
            dispatch({
                type: GET_REVENUE_INDICATORS_REQUEST,
                payload: { revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (deleteRevenueIndicator) {
            setToastMessage("Revenue Indicator Deleted Successfully");
            dispatch({
                type: GET_REVENUE_INDICATORS_REQUEST,
                payload: { revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Revenue Indicator Status Updated Successfully");
            dispatch({
                type: STATUS_REQUEST,
            });
            dispatch({
                type: GET_REVENUE_INDICATORS_REQUEST,
                payload: { revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c' },
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listRevenueIndicator, addRevenueIndicator, updateRevenueIndicator, deleteRevenueIndicator, updateCommon, toast]);

    const handleClicks = async () => {
        setFormData({
            indicator_code: "",
            indicator_description: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setRevenueIndicatorRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {

        const revenueIndicatorData = {
            Id: revenueIndicatorRow.id,
            revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c'
        }
        try {
            dispatch({
                type: DELETE_REVENUE_INDICATORS_REQUEST,
                payload: revenueIndicatorData
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

        if (name === 'indicator_code' && value.length > 3) {
            newValue = value.slice(0, 3);
            setFormErrors({
                ...formErrors,
                indicator_code: "Indicator Code cannot be more than 3 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                indicator_code: ""
            });
        }
        if (name === 'indicator_description' && value.length > 50) {
            setFormErrors({
              ...formErrors,
              indicator_description: "Indicator Description cannot be more than 50 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              indicator_description: ""
            });
          }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.indicator_code.trim()) {
            errors.indicator_code = "Indicator Code is required.";
        } else if (formData.indicator_code.length > 3) {
            errors.indicator_code = "Indicator Code cannot be more than 3 characters"
        }
        if (!formData.indicator_description.trim()) {
            errors.indicator_description = "Indicator Description is required.";
        } else if (formData.indicator_description.length > 50) {
            errors.indicator_description = "Indicator Description cannot be more than 50 characters"
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
                const revenueIndicatorData = {
                    formData,
                    revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c',
                    Id
                };

                dispatch({
                    type: UPDATE_REVENUE_INDICATORS_REQUEST,
                    payload: revenueIndicatorData
                });
            }
            else {
                const revenueIndicatorData = {
                    formData,
                    revenue_indicator_type: location.pathname == "/vendor/revenue_indicator" ? 'v' : 'c',
                };

                dispatch({
                    type: ADD_REVENUE_INDICATORS_REQUEST,
                    payload: revenueIndicatorData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing designation : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setRevenueIndicatorRow(data);
        setFormData({
            indicator_code: data?.indicator_code,
            indicator_description: data?.indicator_description,
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
            Header: "Code",
            accessor: "indicator_code"
        },
        {
            Header: "Description",
            accessor: "indicator_description"
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
                                            name: "revenue_indicators",
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
                        {revenueIndicatorPermission && revenueIndicatorPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}

                        {revenueIndicatorPermission && revenueIndicatorPermission?.can_delete ? (
                            <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const DATA = cellProps.row.original;
                                    onClickDelete(DATA);
                                }}>
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">Delete</UncontrolledTooltip>
                            </Link>
                        ) : null}
                    </div>
                );
            },
        }], [status, revenueIndicatorPermission]);

    document.title = "Detergent | Revenue Indicator";

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
                    <Breadcrumbs titlePath="#" title={location.pathname === "/vendor/revenue_indicator" ? 'Vendor' : 'Customer'}
                    breadcrumbItem="Revenue Indicator" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={revenueIndicators && revenueIndicators.length > 0 ? revenueIndicators : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                revenueIndicatorPermission && revenueIndicatorPermission?.can_add
                                    ? "Add Revenue Indicator"
                                    : null
                            }
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
                                        <Label htmlFor="formrow-state-Input">Id</Label>
                                        <Input
                                            type="text"
                                            name="indicator_code"
                                            className={`form-control ${formErrors.indicator_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Indicator Code"
                                            value={formData?.indicator_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.indicator_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.indicator_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="indicatorDescription">Description</Label>
                                    <Input
                                        type="textarea"
                                        id="indicatorDescription"
                                        name="indicator_description"
                                        className={`form-control ${formErrors.indicator_description ? "is-invalid" : ""
                                            }`}
                                        value={formData.indicator_description}
                                        rows="3"
                                        placeholder="Please Enter Indicator Description"
                                        onChange={handleChange}
                                    />
                                    {formErrors.indicator_description && (
                                        <div className="invalid-feedback">
                                            {formErrors.indicator_description}
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
                                <Button 
                                //color="primary" 
                                type="submit" className="btn-custom-theme ">
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

export default RevenueIndicator;