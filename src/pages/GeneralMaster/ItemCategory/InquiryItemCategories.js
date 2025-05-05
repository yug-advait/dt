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
    GET_INQUIRY_ITEM_REQUEST,
    ADD_INQUIRY_ITEM_REQUEST,
    UPDATE_INQUIRY_ITEM_REQUEST,
    DELETE_INQUIRY_ITEM_REQUEST,
} from "../../../store/inquiryItemCategory/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const InquiryItemCategory = () => {
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [inquiryItemCategoryRow, setInquiryItemCategoryRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        item_category_code: "",
        item_category_description: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { inquiryItemCategories, listInquiryItem, addInquiryItem, updateInquiryItem, deleteInquiryItem, error } = useSelector(
        state => state.inquiryItemCategories || []
    );
    const { updateCommon } = useSelector(state => state.commons);

    useEffect(() => {
        dispatch({
            type: GET_INQUIRY_ITEM_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listInquiryItem) {
            setLoading(false);
        }
        if (addInquiryItem) {
            setToastMessage("Inquiry Item Category Added Successfully");
            dispatch({
                type: GET_INQUIRY_ITEM_REQUEST,
            });
            setToast(true);
        }
        if (updateInquiryItem) {
            setToastMessage("Inquiry Item Category Updated Successfully");
            dispatch({
                type: GET_INQUIRY_ITEM_REQUEST,
            });
            setToast(true);
        }
        if (deleteInquiryItem) {
            setToastMessage("Inquiry Item Category Deleted Successfully");
            dispatch({
                type: GET_INQUIRY_ITEM_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Inquiry Item Category Status Updated Successfully");
            dispatch({ type: UPDATE_STATUS_RESET });
            dispatch({
                type: GET_INQUIRY_ITEM_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listInquiryItem, addInquiryItem, updateInquiryItem, deleteInquiryItem, updateCommon, toast]);

    const handleClicks = async () => {

        setFormData({
            item_category_code: "",
            item_category_description: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setInquiryItemCategoryRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_INQUIRY_ITEM_REQUEST,
                payload: inquiryItemCategoryRow.id
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

        if (name === 'item_category_code' && value.length > 1) {
            newValue = value.slice(0, 1);
            setFormErrors({
                ...formErrors,
                item_category_code: "Item Category Code cannot be more than 1 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                item_category_code: ""
            });
        }

        if (name === 'item_category_description' && value.length > 50) {
            newValue = value.slice(0, 50);
            setFormErrors({
                ...formErrors,
                item_category_description: "Item Category Description cannot be more than 50 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                item_category_description: ""
            });
        }

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.item_category_code.trim()) {
            errors.item_category_code = "Inquiry Item Category Code is required.";
        } else if (formData.item_category_code.length > 1) {
            errors.item_category_code = "Inquiry Item Code cannot be more than 1 characters"
        }
        if (!formData.item_category_description.trim()) {
            errors.item_category_description = "Inquiry Item Category Description is required.";
        } else if (formData.item_category_description.length > 50) {
            errors.item_category_description = "Inquiry Item Category Description cannot be more than 50 characters"
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
                const inquiryItemData = {
                    formData,
                    isActive,
                    Id
                };
                dispatch({
                    type: UPDATE_INQUIRY_ITEM_REQUEST,
                    payload: inquiryItemData
                });
            }
            else {
                const inquiryItemData = {
                    formData,
                    isActive
                };
                dispatch({
                    type: ADD_INQUIRY_ITEM_REQUEST,
                    payload: inquiryItemData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing Inquiry Item Category : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setInquiryItemCategoryRow(data);
        setFormData({
            item_category_code: data?.item_category_code,
            item_category_description: data?.item_category_description,
            isactive: data?.isactive || true,
        });
        setModal(true);
        setIsActive(data?.isactive);
    }

    const resetForm = () => {
        setFormErrors({})
        setErrors({});
        setEdit(null);
    }

    const columns = useMemo(() => [
        {
            Header: "Code",
            accessor: "item_category_code"
        },
        {
            Header: "Description",
            accessor: "item_category_description"
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
                                            name: "item_categories_master",
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

    document.title = "Detergent | Inquiry Item Category";

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
                    <Breadcrumbs titlePath="#" title="Inquiry" breadcrumbItem="Inquiry Item Category" />
                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={inquiryItemCategories && inquiryItemCategories.length > 0 ? inquiryItemCategories : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={"Add Inquiry Item Category"}
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
                                            name="item_category_code"
                                            className={`form-control ${formErrors.item_category_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Inquiry Item Category Code"
                                            value={formData?.item_category_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.item_category_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.item_category_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="inquiryItemCategoryDescription">Description</Label>
                                    <Input
                                        type="textarea"
                                        id="inquiryItemCategoryDescription"
                                        name="item_category_description"
                                        className={`form-control ${formErrors.item_category_description ? "is-invalid" : ""
                                            }`}
                                        value={formData.item_category_description}
                                        rows="3"
                                        placeholder="Please Enter Inquiry Item Category Description"
                                        onChange={handleChange}
                                    />
                                    {formErrors.item_category_description && (
                                        <div className="invalid-feedback">
                                            {formErrors.item_category_description}
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
                                <Button  type="submit" className="btn btn-custom-theme ">
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

export default InquiryItemCategory;