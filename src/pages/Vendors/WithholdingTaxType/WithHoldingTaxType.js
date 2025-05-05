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
import Select from "react-select"
import debounce from 'lodash/debounce'
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
    GET_WITHHOLDING_TAX_TYPES_REQUEST,
    ADD_WITHHOLDING_TAX_TYPES_REQUEST,
    UPDATE_WITHHOLDING_TAX_TYPES_REQUEST,
    DELETE_WITHHOLDING_TAX_TYPES_REQUEST,
} from "../../../store/withholdingTaxType/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const WithHoldingTaxType = () => {

    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [withHoldingTaxTypeRow, setWithHoldingTaxTypeRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [optionCountry, setOptionCountry] = useState([]);
    const [selectCountry, setSelectedCountry] = useState({});
    const [inputCountryValue, setInputCountryValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [withholdingTaxTypesPermission, setWithholdingTaxTypesPermission] = useState();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        withholding_tax_type: "",
        withholding_tax_code: "",
        withholding_tax_percentage: "",
        section_code: "",
        subsection_code: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { listWithHoldingTaxType, withHoldingTaxTypes, addWithHoldingTaxType, updateWithHoldingTaxType, deleteWithHoldingTaxType, error } = useSelector(
        state => state.withHoldingTaxTypes || {}
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
                permission.sub_menu_name === "withholding_taxes"
        );
        setWithholdingTaxTypesPermission(
            permissions.find(permission => permission.sub_menu_name === "withholding_taxes")
        );
        getDropDownData();
        dispatch({
            type: GET_WITHHOLDING_TAX_TYPES_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listWithHoldingTaxType) {
            setLoading(false)
        }
        if (addWithHoldingTaxType) {
            setToastMessage("WithHolding Tax Type Added Successfully");
            dispatch({
                type: GET_WITHHOLDING_TAX_TYPES_REQUEST,
            });
            setToast(true);
        }
        if (updateWithHoldingTaxType) {
            setToastMessage("WithHolding Tax Type Updated Successfully");
            dispatch({
                type: GET_WITHHOLDING_TAX_TYPES_REQUEST,
            });
            setToast(true);
        }
        if (deleteWithHoldingTaxType) {
            setToastMessage("WithHolding Tax Type Deleted Successfully");
            dispatch({
                type: GET_WITHHOLDING_TAX_TYPES_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("WithHolding Tax Type Status Updated Successfully");
            dispatch({
                type: UPDATE_STATUS_RESET,
            });
            dispatch({
                type: GET_WITHHOLDING_TAX_TYPES_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listWithHoldingTaxType, addWithHoldingTaxType, updateWithHoldingTaxType, deleteWithHoldingTaxType, updateCommon, toast]);

    const getDropDownData = async () => {
        const selectData = await getSelectData('country_name', "", 'country')
        setOptionCountry(selectData?.getDataByColNameData);
    }

    const handleClicks = async () => {
        setFormData({
            withholding_tax_type: "",
            withholding_tax_code: "",
            withholding_tax_percentage: "",
            section_code: "",
            subsection_code: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setWithHoldingTaxTypeRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_WITHHOLDING_TAX_TYPES_REQUEST,
                payload: withHoldingTaxTypeRow.id
            });
            setDeleteModal(false);
        }
        catch (error) {
            console.error("Error in deleting data : ", error);
        }
    }

    const handleCountryInputChange = useCallback(
        debounce(async () => {
            try {
                const selectData = await getSelectData('country_name', "", 'country')
                setOptionCountry(selectData?.getDataByColNameData);
            }
            catch (error) {
                console.error('Error in fetching data : ', error);
            }
        }, 300), []
    );

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'withholding_tax_type' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
                ...formErrors,
                withholding_tax_type: "Witholding Tax Type cannot be more than 4 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                withholding_tax_type: ""
            });
        }
        if (name === 'withholding_tax_code' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
                ...formErrors,
                withholding_tax_code: "Witholding Tax Code cannot be more than 4 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                withholding_tax_code: ""
            });
        }
        if (name === 'section_code' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
                ...formErrors,
                section_code: "Witholding Tax Code cannot be more than 4 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                section_code: ""
            });
        }
        if (name === 'withholding_tax_percentage' && value.length > 3) {
            newValue = value.slice(0, 3);
            setFormErrors({
                ...formErrors,
                withholding_tax_percentage: "Witholding Tax Percentage cannot be more than 3 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                withholding_tax_percentage: ""
            });
        }
        if (name === 'subsection_code' && value.length > 4) {
            newValue = value.slice(0, 4);
            setFormErrors({
                ...formErrors,
                subsection_code: "Subsection Code cannot be more than 4 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                subsection_code: ""
            });
        }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.withholding_tax_type.trim()) {
            errors.withholding_tax_type = "Witholding Tax Type is required.";
        } else if (formData.withholding_tax_type.length > 4) {
            errors.withholding_tax_type = "Witholding Tax Type cannot be more than 4 characters"
        }
        if (!formData.withholding_tax_code.trim()) {
            errors.withholding_tax_code = "Withholding Tax Code is required.";
        } else if (formData.withholding_tax_code.length > 4) {
            errors.withholding_tax_code = "Witholding Tax Code cannot be more than 4 characters"
        }
        if (!formData.withholding_tax_percentage) {
            errors.withholding_tax_percentage = "Withholding Tax Percentage is required.";
        } else if (formData.withholding_tax_percentage.length > 3) {
            errors.withholding_tax_percentage = "Witholding Tax Percentage cannot be more than 3 characters"
        }
        if (!formData.section_code.trim()) {
            errors.section_code = "Section Code is required.";
        } else if (formData.section_code.length > 4) {
            errors.section_code = "Section Code cannot be more than 4 characters"
        }
        if (!formData.subsection_code.trim()) {
            errors.subsection_code = "Subsection Code is required.";
        } else if (formData.subsection_code.length > 4) {
            errors.subsection_code = "Subsection Code cannot be more than 4 characters"
        }
        if (Object.keys(selectCountry).length === 0) {
            errors.country = 'Country Name is required.'
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
                const witholdingTaxTypeData = {
                    formData,
                    selectCountry,
                    isActive,
                    Id
                };
                dispatch({
                    type: UPDATE_WITHHOLDING_TAX_TYPES_REQUEST,
                    payload: witholdingTaxTypeData
                });
            }
            else {
                const witholdingTaxTypeData = {
                    formData,
                    selectCountry,
                    isActive
                };
                dispatch({
                    type: ADD_WITHHOLDING_TAX_TYPES_REQUEST,
                    payload: witholdingTaxTypeData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing WithHolding Tax Type : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setWithHoldingTaxTypeRow(data);
        setSelectedCountry(data?.country);
        setFormData({
            withholding_tax_type: data?.withholding_tax_type,
            withholding_tax_code: data?.withholding_tax_code,
            withholding_tax_percentage: data?.withholding_tax_percentage,
            Country: data?.Country,
            section_code: data?.section_code,
            subsection_code: data?.subsection_code,
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
            Header: "Tax Type",
            accessor: "withholding_tax_type"
        },
        {
            Header: "Tax Code",
            accessor: "withholding_tax_code"
        },
        {
            Header: "Tax Percentage",
            accessor: "withholding_tax_percentage"
        }, {
            Header: "Country",
            accessor: "country.label"
        },
        {
            Header: "Section",
            accessor: "section_code"
        },
        {
            Header: "Sub Section",
            accessor: "subsection_code"
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
                                            name: "withholding_tax_type",
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
                        {withholdingTaxTypesPermission && withholdingTaxTypesPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}
                        {withholdingTaxTypesPermission && withholdingTaxTypesPermission?.can_delete ? (
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
        }], [status, withholdingTaxTypesPermission]);

    document.title = "Detergent | Withholding Tax Type"

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
                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="WithHolding Tax Type" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={withHoldingTaxTypes && withHoldingTaxTypes.length > 0 ? withHoldingTaxTypes : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                withholdingTaxTypesPermission && withholdingTaxTypesPermission?.can_add
                                    ? "Add WithHolding Tax Types"
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
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Type</Label>
                                        <Input
                                            type="text"
                                            name="withholding_tax_type"
                                            className={`form-control ${formErrors.withholding_tax_type ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter WithHolding Tax Type"
                                            value={formData?.withholding_tax_type}
                                            onChange={handleChange}
                                        />
                                        {formErrors.withholding_tax_type && (
                                            <div className="invalid-feedback">
                                                {formErrors.withholding_tax_type}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Code</Label>
                                        <Input
                                            type="text"
                                            name="withholding_tax_code"
                                            className={`form-control ${formErrors.withholding_tax_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter WithHolding Tax Code"
                                            value={formData?.withholding_tax_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.withholding_tax_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.withholding_tax_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Percentage</Label>
                                        <Input
                                            type="number"
                                            name="withholding_tax_percentage"
                                            className={`form-control ${formErrors.withholding_tax_percentage ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter WithHolding Tax Percentage"
                                            value={formData?.withholding_tax_percentage}
                                            onChange={handleChange}
                                        />
                                        {formErrors.withholding_tax_percentage && (
                                            <div className="invalid-feedback">
                                                {formErrors.withholding_tax_percentage}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Country Name</Label>
                                        <Select
                                            value={selectCountry}
                                            onChange={(selectCountry) => setSelectedCountry(selectCountry)}
                                            onInputChange={(inputCountryValue, { action }) => {
                                                setInputCountryValue(inputCountryValue);
                                                handleCountryInputChange(inputCountryValue);
                                            }}
                                            options={optionCountry}
                                        />
                                        {formErrors.Country && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.Country}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Section Code</Label>
                                        <Input
                                            type="text"
                                            name="section_code"
                                            className={`form-control ${formErrors.section_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Section Code"
                                            value={formData?.section_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.section_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.section_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Subsection Code</Label>
                                        <Input
                                            type="text"
                                            name="subsection_code"
                                            className={`form-control ${formErrors.subsection_code ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Subsection Code"
                                            value={formData?.subsection_code}
                                            onChange={handleChange}
                                        />
                                        {formErrors.subsection_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.subsection_code}
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

export default WithHoldingTaxType