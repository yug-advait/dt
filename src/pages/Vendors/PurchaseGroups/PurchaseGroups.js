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
    GET_PURCHASE_GROUPS_REQUEST,
    ADD_PURCHASE_GROUPS_REQUEST,
    UPDATE_PURCHASE_GROUPS_REQUEST,
    DELETE_PURCHASE_GROUPS_REQUEST,
} from "../../../store/purchaseGroups/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PurchaseGroups = () => {
    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [purchaseGroupRow, setPurchaseGroupRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [purchaseGroupsPermission, setpurchaseGroupsPermission] = useState();
    const [formData, setFormData] = useState({
        purchase_group_code: "",
        purchase_group_description: "",
        isactive: isActive
    });
    const dispatch = useDispatch();

    const { listPurchaseGroup, purchaseGroups, addPurchaseGroup, updatePurchaseGroup, deletePurchaseGroup, error } = useSelector(
        state => state.purchaseGroups || {}
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
                permission.sub_menu_name === "purchase_group"
        );
        setpurchaseGroupsPermission(
            permissions.find(permission => permission.sub_menu_name === "purchase_group")
        );
        dispatch({
            type: GET_PURCHASE_GROUPS_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listPurchaseGroup) {
            setLoading(false)
        }
        if (addPurchaseGroup) {
            setToastMessage("Purchase Group Added Successfully");
            dispatch({
                type: GET_PURCHASE_GROUPS_REQUEST,
            });
            setToast(true);
        }
        if (updatePurchaseGroup) {
            setToastMessage("Purchase Group Updated Successfully");
            dispatch({
                type: GET_PURCHASE_GROUPS_REQUEST,
            });
            setToast(true);
        }
        if (deletePurchaseGroup) {
            setToastMessage("Purchase Group Deleted Successfully");
            dispatch({
                type: GET_PURCHASE_GROUPS_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Purchase Group Status Updated Successfully");
            dispatch({
                type: UPDATE_STATUS_RESET,
            });
            dispatch({
                type: GET_PURCHASE_GROUPS_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listPurchaseGroup, addPurchaseGroup, updatePurchaseGroup, deletePurchaseGroup, updateCommon, toast]);

    const handleClicks = async () => {
        setFormData({
            purchase_group_code: "",
            purchase_group_description: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setPurchaseGroupRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_PURCHASE_GROUPS_REQUEST,
                payload: purchaseGroupRow.id
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

        if (name === 'purchase_group_code' && value.length > 6) {
            newValue = value.slice(0, 6);
            setFormErrors({
                ...formErrors,
                purchase_group_code: "Purchase Group Code cannot be more than 6 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                purchase_group_code: ""
            });
        }
        if (name === 'purchase_group_description' && value.length > 50) {
            setFormErrors({
              ...formErrors,
              purchase_group_description: "Purchase Group Description cannot be more than 50 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              purchase_group_description: ""
            });
          }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.purchase_group_code.trim()) {
            errors.purchase_group_code = "Purchase Group Code is required.";
        }
        else if (formData.purchase_group_code.length > 6) {
            errors.purchase_group_code = "Purchase Group Code cannot be more than 6 characters"
        }
        if (!formData.purchase_group_description.trim()) {
            errors.purchase_group_description = "Purchase Group Description is required.";
        }
        else if (formData.purchase_group_description.length > 50) {
            errors.purchase_group_description = "Purchase Group Description cannot be more than 50 characters"
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
                const purchaseGroupData = {
                    formData,
                    Id
                };

                dispatch({
                    type: UPDATE_PURCHASE_GROUPS_REQUEST,
                    payload: purchaseGroupData
                });
            }
            else {
                const purchaseGroupData = {
                    formData,
                };

                dispatch({
                    type: ADD_PURCHASE_GROUPS_REQUEST,
                    payload: purchaseGroupData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing Purchase Groups : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setPurchaseGroupRow(data);
        setFormData({
            purchase_group_code: data?.purchase_group_code,
            purchase_group_description: data?.purchase_group_description,
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
            accessor: "purchase_group_code"
        },
        {
            Header: "Description",
            accessor: "purchase_group_description"
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
                                            name: "purchase_group",
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
                        {purchaseGroupsPermission && purchaseGroupsPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}
                        {purchaseGroupsPermission && purchaseGroupsPermission?.can_delete ? (
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
        }], [status, purchaseGroupsPermission]);

    document.title = "Detergent | Purchase Groups";

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
                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Purchase Groups" />
                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={purchaseGroups && purchaseGroups.length > 0 ? purchaseGroups : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                purchaseGroupsPermission && purchaseGroupsPermission?.can_add
                                    ? "Add Purchase Groups"
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
                                            name="purchase_group_code"
                                            className={`form-control ${formErrors.purchase_group_code ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Purchase Group Code"
                                            value={formData?.purchase_group_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.purchase_group_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.purchase_group_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Description</Label>
                                        <Input
                                            type="text"
                                            name="purchase_group_description"
                                            className={`form-control ${formErrors.purchase_group_description ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Description"
                                            value={formData?.purchase_group_description}
                                            onChange={handleChange}
                                        />
                                        {formErrors.purchase_group_description && (
                                            <div className="invalid-feedback">
                                                {formErrors.purchase_group_description}
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

export default PurchaseGroups;