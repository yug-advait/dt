import React, { useEffect, useMemo, useState, useCallback } from "react";
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
    GET_PAYMENT_TERMS_REQUEST,
    ADD_PAYMENT_TERMS_REQUEST,
    UPDATE_PAYMENT_TERMS_REQUEST,
    DELETE_PAYMENT_TERMS_REQUEST,
} from "../../../store/paymentTerms/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PaymentTerms = () => {

    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [paymentTermRow, setPaymentTermRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [paymentTermsPermission, setPaymentTermsPermission] = useState();
    const [formData, setFormData] = useState({
        payment_code: "",
        payment_description: "",
        isactive: isActive
    });
    const dispatch = useDispatch();
    const { listPaymentTerm, paymentTerms, addPaymentTerm, updatePaymentTerm, deletePaymentTerm, error } = useSelector(
        state => state.paymentTerms || {}
    );
    const { updateCommon } = useSelector(state => state.commons);
    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    };

    useEffect(() => {
        const userData = getUserData();
        var permissions = userData?.permissionList?.filter(
            permission =>
                permission.sub_menu_name === "payment_terms"
        );
        setPaymentTermsPermission(
            permissions.find(permission => permission.sub_menu_name === "payment_terms")
        );
        dispatch({
            type: GET_PAYMENT_TERMS_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listPaymentTerm) {
            setLoading(false)
        }
        if (addPaymentTerm) {
            setToastMessage("Payment Term Added Successfully");
            dispatch({
                type: GET_PAYMENT_TERMS_REQUEST,
            });
            setToast(true);
        }
        if (updatePaymentTerm) {
            setToastMessage("Payment Term Updated Successfully");
            dispatch({
                type: GET_PAYMENT_TERMS_REQUEST,
            });
            setToast(true);
        }
        if (deletePaymentTerm) {
            setToastMessage("Payment Term Deleted Successfully");
            dispatch({
                type: GET_PAYMENT_TERMS_REQUEST,
            });
            setToast(true);
        }

        if (updateCommon) {
            
            setToastMessage("Payment Term Status Updated Successfully");
            dispatch({
                type: UPDATE_STATUS_RESET,
            });
            dispatch({
                type: GET_PAYMENT_TERMS_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listPaymentTerm, addPaymentTerm, updatePaymentTerm, deletePaymentTerm, updateCommon, toast]);

    const handleClicks = async () => {
        setFormData({
            payment_code: "",
            payment_description: "",
            isactive: true
        })
        setModal(true)
    };
    const onClickDelete = item => {
        setPaymentTermRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_PAYMENT_TERMS_REQUEST,
                payload: paymentTermRow.id
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

        if (name === 'payment_code' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
                ...formErrors,
                payment_code: "Payment Code cannot be more than 4 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                payment_code: ""
            });
        }
        if (name === 'payment_description' && value.length > 200) {
            setFormErrors({
                ...formErrors,
                payment_description: "Payment Description cannot be more than 200 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                payment_description: ""
            });
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.payment_code.trim()) {
            errors.payment_code = "Payment Code is required.";
        }
        else if (formData.payment_code.length > 4) {
            errors.payment_code = "Payment Code cannot be more than 4 characters"
        }
        if (!formData.payment_description) {
            errors.payment_description = "Payment Description is required.";
        }
        else if (formData.payment_description.length > 200) {
            errors.payment_description = "Payment Description cannot be more than 200 characters"
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
                const paymentTermData = {
                    formData,
                    Id
                };

                dispatch({
                    type: UPDATE_PAYMENT_TERMS_REQUEST,
                    payload: paymentTermData
                });
            }
            else {
                const paymentTermData = {
                    formData,
                };

                dispatch({
                    type: ADD_PAYMENT_TERMS_REQUEST,
                    payload: paymentTermData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing Payment Terms : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setPaymentTermRow(data);
        setFormData({
            payment_code: data?.payment_code,
            payment_description: data?.payment_description,
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
            accessor: "payment_code"
        },
        {
            Header: "Description",
            accessor: "payment_description"
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
                                            name: "payment_terms",
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
                        {paymentTermsPermission && paymentTermsPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}

                        {paymentTermsPermission && paymentTermsPermission?.can_delete ? (
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
                        ) : null}
                    </div>
                );
            },
        }], [status, paymentTermsPermission]);

    document.title = "Detergent | Payment Terms";

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
                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Payment Terms" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={paymentTerms && paymentTerms.length > 0 ? paymentTerms : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                paymentTermsPermission && paymentTermsPermission?.can_add
                                    ? "Add Payment Terms"
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
                                        <Label htmlFor="formrow-state-Input">Code</Label>
                                        <Input
                                            type="text"
                                            name="payment_code"
                                            className={`form-control ${formErrors.payment_code ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Payment Code"
                                            value={formData?.payment_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.payment_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.payment_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Description</Label>
                                        <Input
                                            type="text"
                                            name="payment_description"
                                            className={`form-control ${formErrors.payment_description ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Description"
                                            value={formData?.payment_description}
                                            onChange={handleChange}
                                        />
                                        {formErrors.payment_description && (
                                            <div className="invalid-feedback">
                                                {formErrors.payment_description}
                                            </div>
                                        )}
                                    </div>
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

export default PaymentTerms;