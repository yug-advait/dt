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
    GET_DESIGNATIONS_REQUEST,
    ADD_DESIGNATIONS_REQUEST,
    UPDATE_DESIGNATIONS_REQUEST,
    DELETE_DESIGNATIONS_REQUEST,
} from "../../../store/designation/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const Designation = () => {
    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [designationRow, setDesignationRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [optionCompany, setOptionCompany] = useState([]);
    const [selectCompany, setSelectedCompany] = useState({});
    const [inputCompanyValue, setInputCompanyValue] = useState('');
    const [optionDepartment, setOptionDepartment] = useState([]);
    const [selectDepartment, setSelectedDepartment] = useState({});
    const [inputDepartmentValue, setInputDepartmentValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        designation_id: "",
        designation_description: "",
        remarks: "",
        isactive: isActive
    });
    const [designationPermission, setDesignationPermission] = useState();
    const dispatch = useDispatch();
    const { designations, addDesignation, updateDesignation, listDesignation, deleteDesignation, error } = useSelector(
        state => state.designations || {}
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
                permission.sub_menu_name === "designations"
        );
        setDesignationPermission(
            permissions.find(permission => permission.sub_menu_name === "designations")
        );
        dispatch({
            type: GET_DESIGNATIONS_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listDesignation) {
            setLoading(false)
        }
        if (addDesignation) {
            setToastMessage("Designation Added Successfully");
            dispatch({
                type: GET_DESIGNATIONS_REQUEST,
            });
            setToast(true);
        }
        if (updateDesignation) {
            setToastMessage("Designation Updated Successfully");
            dispatch({
                type: GET_DESIGNATIONS_REQUEST,
            });
            setToast(true);
        }
        if (deleteDesignation) {
            setToastMessage("Designation Deleted Successfully");
            dispatch({
                type: GET_DESIGNATIONS_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Designation Status Updated Successfully");
            dispatch({
                type: STATUS_REQUEST,
            });
            dispatch({
                type: GET_DESIGNATIONS_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [addDesignation, updateDesignation, deleteDesignation, listDesignation, updateCommon, toast]);

    const handleClicks = async () => {
        const selectCompanyData = await getSelectData('company_name', "", 'company_legal_entity')
        setOptionCompany(selectCompanyData?.getDataByColNameData);
        const selectDepartmentData = await getSelectData('department_description', "", 'department');
        setOptionDepartment(selectDepartmentData?.getDataByColNameData);

        setFormData({
            designation_id: "",
            designation_description: "",
            remarks: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setDesignationRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_DESIGNATIONS_REQUEST,
                payload: designationRow.id
            });

            setDeleteModal(false);
        }
        catch (error) {
            console.error("Error in deleting data : ", error);
        }
    }

    const handleCompanyInputChange = useCallback(
        debounce(async (inputCompanyValue) => {
            try {
                const selectData = await getSelectData('company_name', inputCompanyValue, 'company_legal_entity');
                setOptionCompany(selectData?.getDataByColNameData);
            }
            catch (error) {
                console.error('Error in fetching data : ', error);
            }
        }, 300), []
    );

    const handleDepartmentInputChange = useCallback(
        debounce(async (inputDepartmentValue) => {
            try {
                const selectData = await getSelectData('department_description', inputDepartmentValue, 'department');
                setOptionDepartment(selectData?.getDataByColNameData);
            }
            catch (error) {
                console.error('Error in fetching data : ', error);
            }
        }, 300), []
    );

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'designation_id' && value.length > 6) {
            setFormErrors({
              ...formErrors,
              designation_id: "Designation Id cannot be more than 6 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              designation_id: ""
            });
          }
        if (name === 'designation_description' && value.length >506) {
            setFormErrors({
              ...formErrors,
              designation_description: "Designation Description cannot be more than 50 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              designation_description: ""
            });
          }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (Object.keys(selectDepartment).length === 0) {
            errors.department = 'Department Name is required.'
        }
        if (!formData.designation_id.trim()) {
            errors.designation_id = "Designation ID is required.";
        }
        else if (formData.designation_id.length > 6) {
            errors.designation_id = "Designation ID cannot be more than 6 characters"
          }
        if (!formData.designation_description.trim()) {
            errors.designation_description = "Designation Description is required.";
        }
        else if (formData.designation_description.length > 50) {
            errors.designation_description = "Designation Description cannot be more than 50 characters"
          }
        if (Object.keys(selectCompany).length === 0) {
            errors.company = 'Company Name is required.'
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
                const designationData = {
                    formData,
                    selectCompany,
                    selectDepartment,
                    isActive,
                    Id
                };

                dispatch({
                    type: UPDATE_DESIGNATIONS_REQUEST,
                    payload: designationData
                });
            }
            else {
                const designationData = {
                    formData,
                    selectCompany,
                    selectDepartment,
                    isActive
                };

                dispatch({
                    type: ADD_DESIGNATIONS_REQUEST,
                    payload: designationData
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
        setDesignationRow(data);
        setSelectedCompany(data?.company);
        setSelectedDepartment(data?.department);
        setFormData({
            designation_id: data?.designation_id,
            designation_description: data?.designation_description,
            remarks: data?.remarks,
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
            Header: "Id",
            accessor: "designation_id"
        },
        {
            Header: "Department",
            accessor: "department.label"
        },
        {
            Header: "Description",
            accessor: "designation_description"
        }, {
            Header: "Company",
            accessor: "company.label"
        },
        {
            Header: "Remarks",
            accessor: "remarks"
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
                                            name: "designation",
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
                        {designationPermission && designationPermission?.can_edit ? (
                        <Link
                            to="#"
                            className="text-success"
                            onClick={() => openModal(cellProps.row.original)}>
                            <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                            <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                        </Link>
                    ) : null}

                        {designationPermission && designationPermission?.can_delete ? (
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
        }], [status, designationPermission]);

    document.title = "Detergent | Designation";

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

                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Designation" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={designations && designations.length > 0 ? designations : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                designationPermission && designationPermission?.can_add
                                  ? "Add Designation"
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
                                        <Label htmlFor="formrow-state-Input">Id</Label>
                                        <Input
                                            type="text"
                                            name="designation_id"
                                            className={`form-control ${formErrors.designation_id ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Designation Id"
                                            value={formData?.designation_id}
                                            onChange={handleChange}
                                        />
                                        {formErrors.designation_id && (
                                            <div className="invalid-feedback">
                                                {formErrors.designation_id}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Department Name</Label>
                                        <Select
                                            value={selectDepartment}
                                            onChange={(selectDepartment) => setSelectedDepartment(selectDepartment)}
                                            onInputChange={(inputDepartmentValue, { action }) => {
                                                setInputDepartmentValue(inputDepartmentValue);
                                                handleDepartmentInputChange(inputDepartmentValue);
                                            }}
                                            options={optionDepartment}
                                        />
                                        {formErrors.department && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.department}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={12} className="mb-3">
                                    <Label htmlFor="designationDescription">Description</Label>
                                    <Input
                                        type="textarea"
                                        id="designationDescription"
                                        name="designation_description"
                                        className={`form-control ${formErrors.designation_description ? "is-invalid" : ""
                                            }`}
                                        value={formData.designation_description}
                                        rows="3"
                                        placeholder="Please Enter Designation Description"
                                        onChange={handleChange}
                                    />
                                    {formErrors.designation_description && (
                                        <div className="invalid-feedback">
                                            {formErrors.designation_description}
                                        </div>
                                    )}
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Company Name</Label>
                                        <Select
                                            value={selectCompany}
                                            onChange={(selectCompany) => setSelectedCompany(selectCompany)}
                                            onInputChange={(inputCompanyValue, { action }) => {
                                                setInputCompanyValue(inputCompanyValue);
                                                handleCompanyInputChange(inputCompanyValue);
                                            }}
                                            options={optionCompany}
                                        />
                                        {formErrors.company && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.company}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Remarks</Label>
                                        <Input
                                            type="text"
                                            name="remarks"
                                            className={`form-control ${formErrors.remarks ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Remarks"
                                            value={formData?.remarks}
                                            onChange={handleChange}
                                        />
                                        {formErrors.remarks && (
                                            <div className="invalid-feedback">
                                                {formErrors.remarks}
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

export default Designation;