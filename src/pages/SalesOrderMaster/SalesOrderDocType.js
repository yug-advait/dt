import React, { useEffect, useState, useMemo } from "react";
import {
    Row,
    Col,
    UncontrolledTooltip,
    Button,
    Modal,
    Form,
    Label,
    Input,
    Alert,
} from "reactstrap";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import moment from "moment";
import {
    ADD_SALES_ORDER_DOCTYPE_REQUEST,
    GET_SALES_ORDER_DOCTYPE_REQUEST,
    UPDATE_SALES_ORDER_DOCTYPE_REQUEST,
    DELETE_SALES_ORDER_DOCTYPE_REQUEST,
} from "../../store/salesOrderDocType/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import Loader from "../../components/Common/Loader";
import "../../assets/scss/custom/pages/__loader.scss";

const SalesOrderDocType = () => {

    const dispatch = useDispatch();
    const { salesOrderDocType, listSalesOrderDocType, addSalesOrderDocType, updateSalesOrderDocType, deleteSalesOrderDocType } = useSelector(state => state.salesOrderDocType);
    const { updateCommon } = useSelector(state => state.commons);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [rowData, setRowData] = useState("");
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [isActive, setIsActive] = useState(true);
    const [Edit, setEdit] = useState(null);

    const [optionItemCategory, setOptionItemCategory] = useState([]);
    const [selectItemCategory, setSelectItemCategory] = useState({});

    const [formData, setFormData] = useState({
        sales_order_doc_type: "",
        sales_order_doc_type_description: "",
        item_category_id: "",
        isactive: isActive,
    });

    useEffect(() => {
        dispatch({ type: GET_SALES_ORDER_DOCTYPE_REQUEST, payload: [] });
    }, [dispatch]);

    useEffect(() => {
        if (listSalesOrderDocType) {
            setLoading(false);
        }
        if (addSalesOrderDocType) {
            setToastMessage("Sales Order Doc Type Added Successfully");
            dispatch({ type: GET_SALES_ORDER_DOCTYPE_REQUEST });
            setToast(true);
        }
        if (updateSalesOrderDocType) {
            setToastMessage("Sales Order Doc Type Updated Successfully");
            dispatch({ type: GET_SALES_ORDER_DOCTYPE_REQUEST });
            setToast(true);
        }
        if (deleteSalesOrderDocType) {
            setToastMessage("Sales Order Doc Type Deleted Successfully");
            dispatch({ type: GET_SALES_ORDER_DOCTYPE_REQUEST });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Sales Order Doc Type Status Updated Successfully");
            dispatch({ type: UPDATE_STATUS_RESET });
            dispatch({ type: GET_SALES_ORDER_DOCTYPE_REQUEST });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listSalesOrderDocType, addSalesOrderDocType, updateSalesOrderDocType, deleteSalesOrderDocType, updateCommon, dispatch]);

    const handleClicks = async () => {
        setSelectItemCategory({});
        setOptionItemCategory(salesOrderDocType?.category);

        setFormData({
            sales_order_doc_type: "",
            sales_order_doc_type_description: "",
            item_category_id: "",
            isactive: true,
        });
        setModal(true);
    };

    const onClickDelete = item => {
        setRowData(item);
        setDeleteModal(true);
    };

    const handleDelete = () => {
        dispatch({ type: DELETE_SALES_ORDER_DOCTYPE_REQUEST, payload: rowData.id });
        setDeleteModal(false);
    };

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;
        if (name === 'sales_order_doc_type' && value.length > 6) {
            newValue = value.slice(0, 6);
            setFormErrors({
                ...formErrors,
                sales_order_doc_type: "Sales Order Doc Type cannot be more than 6 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                sales_order_doc_type: ""
            });
        }

        if (name === 'sales_order_doc_type_description' && value.length > 50) {
            newValue = value.slice(0, 50);
            setFormErrors({
                ...formErrors,
                sales_order_doc_type_description: "Sales Order Doc Type Description cannot be more than 50 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                sales_order_doc_type_description: ""
            });
        }
        setFormData({ ...formData, [name]: value });
    };

    const autoResizeTextarea = textarea => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.sales_order_doc_type) errors.sales_order_doc_type = "Sales Order Doc Type is required";
        else if (formData.sales_order_doc_type.length > 6)
            errors.sales_order_doc_type = "Sales Order Doc Type cannot be more than 6 characters"

        if (!formData.sales_order_doc_type_description)
            errors.sales_order_doc_type_description = "Sales Order Doc Type Description is required";
        else if (formData.sales_order_doc_type_description.length > 50)
            errors.sales_order_doc_type_description = "Sales Order Doc Type Description cannot be more than 50 characters"

        if (!formData.item_category_id)
            errors.item_category_id = "Item category Id is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveOrEdit = e => {
        e.preventDefault();
        if (!validateForm()) return;

        if (Edit) {
            dispatch({
                type: UPDATE_SALES_ORDER_DOCTYPE_REQUEST,
                payload: { Id: Edit.id, formData },
            });
        } else {
            dispatch({
                type: ADD_SALES_ORDER_DOCTYPE_REQUEST,
                payload: { formData },
            });
        }
        setModal(false);
        setEdit(null);
        resetForm();
    };

    const openModal = (data = null) => {
        setEdit(data);
        setRowData(data);
        setSelectItemCategory(data?.item_category);
        setFormData({
            sales_order_doc_type: data?.sales_order_doc_type || "",
            sales_order_doc_type_description: data?.sales_order_doc_type_description || "",
            item_category_id: data?.item_category?.value || "",
            isactive: data?.isactive || true,
        });
        setModal(true);
        setIsActive(data?.isactive);
    };

    const resetForm = () => {
        setFormErrors({})
        setErrors({});
        setEdit(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: "Sales Order Doc Type",
                accessor: "sales_order_doc_type",
            },
            {
                Header: "Sales Order Doc Type Description",
                accessor: "sales_order_doc_type_description",
            },
            {
                Header: "Item Category",
                accessor: "item_category.label",
            },
            {
                Header: "Created On",
                accessor: "createdon",
                Cell: ({ value }) => moment(value).format("DD/MM/YYYY"),
            },
            {
                Header: "Status",
                accessor: "isactive",
                Cell: cellProps => (
                    <div className="form-check form-switch mb-3" dir="ltr">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={cellProps.row.original.isactive}
                            onClick={() => {
                                dispatch({
                                    type: STATUS_REQUEST,
                                    payload: {
                                        name: "sales_order_doc_type_master",
                                        isactive: !cellProps.row.original.isactive,
                                        id: cellProps.row.original?.id,
                                    },
                                });
                            }}
                        />
                    </div>
                ),
            },
            {
                Header: "Actions",
                accessor: "action",
                disableFilters: true,
                Cell: cellProps => (
                    <div className="d-flex gap-3">
                        <Link
                            to="#"
                            className="text-success"
                            onClick={() => {
                                openModal(cellProps.row.original);
                                setOptionItemCategory(salesOrderDocType?.category);
                            }}
                        >
                            <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                            <UncontrolledTooltip placement="top" target="edittooltip">
                                Edit
                            </UncontrolledTooltip>
                        </Link>
                        <Link
                            to="#"
                            className="text-danger"
                            onClick={() => onClickDelete(cellProps.row.original)}
                        >
                            <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                            <UncontrolledTooltip placement="top" target="deletetooltip">
                                Delete
                            </UncontrolledTooltip>
                        </Link>
                    </div>
                ),
            },
        ], [salesOrderDocType, dispatch]
    );

    document.title = "Detergent | Sales Order Doc Type";
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
                    <Breadcrumbs
                        titlePath="#"
                        title="Sales Order"
                        breadcrumbItem="Sales Order Doc Type"
                    />
                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={
                                salesOrderDocType.salesOrderDocTypes && salesOrderDocType.salesOrderDocTypes.length > 0
                                    ? salesOrderDocType.salesOrderDocTypes
                                    : []
                            }
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={"Add Doc Type"}
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
                                    <Label htmlFor="formrow-state-Input">Sales Order Doc Type</Label>
                                    <Input
                                        type="text"
                                        name="sales_order_doc_type"
                                        className={`form-control ${formErrors.sales_order_doc_type ? "is-invalid" : ""}`}
                                        id="formrow-state-Input"
                                        placeholder="Please Enter Item Category Code"
                                        value={formData?.sales_order_doc_type}
                                        onChange={handleChange}
                                    />
                                    {formErrors.sales_order_doc_type && (
                                        <div className="invalid-feedback">
                                            {formErrors.sales_order_doc_type}
                                        </div>
                                    )}
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="categoryDescription">
                                        Sales Doc Type Description
                                    </Label>
                                    <Input
                                        type="textarea"
                                        id="categoryDescription"
                                        name="sales_order_doc_type_description"
                                        className={`form-control ${formErrors.sales_order_doc_type_description ? "is-invalid" : ""}`}
                                        value={formData.sales_order_doc_type_description}
                                        rows="3"
                                        placeholder="Please Enter Sales Order Doc Type Description"
                                        onChange={e => {
                                            autoResizeTextarea(e.target);
                                            setFormData(prevData => ({
                                                ...prevData,
                                                sales_order_doc_type_description: e.target.value,
                                            }));
                                            setFormErrors(prevErrors => ({
                                                ...prevErrors,
                                                sales_order_doc_type_description: "",
                                            }));
                                        }}
                                    />
                                    {formErrors.sales_order_doc_type_description && (
                                        <div className="invalid-feedback">
                                            {formErrors.sales_order_doc_type_description}
                                        </div>
                                    )}
                                </Col>
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="name">Item Category</Label>
                                    <Select
                                        value={selectItemCategory}
                                        onChange={async selectItemCategory => {
                                            setFormData(prevData => ({
                                                ...prevData,
                                                item_category_id: selectItemCategory?.value,
                                            }));
                                            setSelectItemCategory(selectItemCategory);
                                        }}
                                        options={optionItemCategory}
                                    />
                                    {formErrors.item_category_id && (
                                        <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                                            {formErrors.item_category_id}
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
                                        <label
                                            className="form-check-label"
                                            htmlFor="customSwitchsizesm"
                                        >
                                            Status
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <Button
                                    //color="primary"
                                    type="submit"
                                    className="btn-custom-theme">Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default SalesOrderDocType;