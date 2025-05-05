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
    Alert,
} from "reactstrap";
import Select from 'react-select';
import { Link } from "react-router-dom";
import debounce from "lodash/debounce";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import { getSelectData } from "helpers/Api/api_common";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

// Import API service
import {
    fetchGroupCreation,
    addGroupCreation,
    updateGroupCreation,
    deleteGroupCreation,
} from "../../../helpers/Api/api_creationGroup";

const GroupCreation = () => {
    const [modal, setModal] = useState(false);
    const [groupCreation, setGroupCreation] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedUnder, setSelectedUnder] = useState({});
    const [selectDepartment, setSelectedDepartment] = useState({});
    const [optionDepartment, setOptionDepartment] = useState([]);
    const [rowData, setRowData] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [groupCreationPermission, setGroupCreationPermission] = useState();
    const [formData, setFormData] = useState({
        name: "",
        isactive: isActive,
        under: "",
        is_subledger: false,
        nett_balances: false,
        used_for_calculation: false,
        allocation_method: "",
    });

    // Fetch groups
    const getGroupCreation = async () => {
        try {
            setLoading(true);
            const data = await fetchGroupCreation();
            setGroupCreation(data);
            setLoading(false);
        } catch (error) {
            console.error("Error in getGroupCreation:", error);
            setLoading(false);
        }
    };

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
                permission.sub_menu_name === "employee_group"
        );
        setGroupCreationPermission(
            permissions.find(permission => permission.sub_menu_name === "employee_group")
        );
        getGroupCreation();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [toast]);

    const handleClicks = async () => {
        setSelectedDepartment({})
        setFormData({
            name: "",
            isactive: true,
            under: "",
            is_subledger: false,
            nett_balances: false,
            used_for_calculation: false,
            allocation_method: "",
        });
        setModal(true);
    };

    const onClickDelete = item => {
        setRowData(item);
        setDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            await deleteGroupCreation(rowData.id);
            setToastMessage("Employee Group Deleted Successfully");
            setToast(true);
            getGroupCreation();
            setDeleteModal(false);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'name' && value.length > 10) {
            newValue = value.slice(0, 10);
            setFormErrors({
                ...formErrors,
                name: "Name cannot be more than 10 characters"
            });
        } else {
            setFormErrors({
                ...formErrors,
                name: ""
            });
        }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = "Name is required";
        } else if (formData.name.length > 10) {
            errors.name = "Name cannot be more than 10 characters"
        }
        if (!formData.under) {
            errors.under = "Under is required";
        }
        if (!formData.allocation_method) {
            errors.allocation_method = "Allocation Method is required";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveOrEdit = async e => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            if (Edit) {
                const Id = Edit.id;
                const Data = {
                    ...formData,
                    isactive: isActive,
                };
                await updateGroupCreation(Id, Data);
                setToastMessage("Employee Group Updated Successfully");
            } else {
                const Data = {
                    ...formData,
                    isactive: isActive,
                };
                await addGroupCreation(Data);
                setToastMessage("Employee Group Added Successfully");
            }
            setToast(true);
            getGroupCreation();
            setModal(false);
            setEdit(null);
            resetForm();
        } catch (error) {
            console.error("Error saving/editing data:", error);
        }
    };

    const handleInputChangeDepartment = useCallback(
        debounce(async inputValue => {
            try {
                const selectData = await getSelectData(
                    "department_description",
                    inputValue,
                    "department"
                );
                setOptionDepartment(selectData?.getDataByColNameData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }, 300),
        []
    );

    const openModal = (data = null) => {
        setEdit(data);
        setRowData(data);
        setSelectedDepartment(data?.department)
        setFormData({
            name: data?.name || "",
            isactive: data?.isactive || true,
            under: data?.under || "",
            is_subledger: data?.is_subledger || false,
            nett_balances: data?.nett_balances || false,
            used_for_calculation: data?.used_for_calculation || false,
            allocation_method: data?.allocation_method || "",
        });
        setModal(true);
        if (data) {
            setIsActive(data.isactive);
        }
    };

    const resetForm = () => {
        setFormErrors({})
        setErrors({});
        setEdit(null);
    };

    const handleUnderChange = (selectedOption) => {
        setSelectedUnder(selectedOption);
        setFormData(prev => ({
            ...prev,
            under: selectedOption?.value || ""
        }));
    };

    const [selectedAllocationMethod, setSelectedAllocationMethod] = useState({});

    const handleAllocationMethodChange = (selectedOption) => {
        setSelectedAllocationMethod(selectedOption);
        setFormData(prev => ({
            ...prev,
            allocation_method: selectedOption?.value || ""
        }));
    };

    const columns = useMemo(
        () => [
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Actions",
                accessor: "action",
                disableFilters: true,
                Cell: cellProps => {
                    return (
                        <div className="d-flex gap-3">
                            {groupCreationPermission && groupCreationPermission?.can_edit ? (
                                <Link
                                    to="#"
                                    className="text-success"
                                    onClick={() => openModal(cellProps.row.original)}
                                >
                                    <i
                                        className="mdi mdi-pencil-box font-size-18"
                                        id="edittooltip"
                                    />
                                    <UncontrolledTooltip placement="top" target="edittooltip">
                                        Edit
                                    </UncontrolledTooltip>
                                </Link>
                            ) : null}

                            {groupCreationPermission && groupCreationPermission?.can_delete ? (
                                <Link
                                    to="#"
                                    className="text-danger"
                                    onClick={() => {
                                        const DATA = cellProps.row.original;
                                        onClickDelete(DATA);
                                    }}
                                >
                                    <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                    <UncontrolledTooltip placement="top" target="deletetooltip">
                                        Delete
                                    </UncontrolledTooltip>
                                </Link>
                            ) : null}
                        </div>
                    );
                },
            },
        ],
        [groupCreationPermission]
    );

    document.title = "Detergent | Group Creation";
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
                    <Breadcrumbs titlePath="#" title="Accounting" breadcrumbItem="Group Creation" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={groupCreation && groupCreation.length > 0 ? groupCreation : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                groupCreationPermission && groupCreationPermission?.can_add
                                    ? "Add Groups"
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
                                    <div className="">
                                        <Label htmlFor="formrow-state-Input">Name</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            className={`form-control ${formErrors.name ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Name"
                                            value={formData?.name}
                                            onChange={handleChange}
                                        />
                                        {formErrors.name && (
                                            <div className="invalid-feedback">
                                                {formErrors.name}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Under</Label>
                                        <Select
                                            id="formrow-state-Input"
                                            value={selectedUnder}
                                            onChange={handleUnderChange}
                                            options={[
                                                { value: 'companyA', label: 'Company A' },
                                                { value: 'companyB', label: 'Company B' },
                                                { value: 'companyC', label: 'Company C' }
                                            ]}
                                        />
                                        {formErrors.under && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.under}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="allocation-method">Method to allocate when used in purchase invoice</Label>
                                        <Select
                                            id="allocation-method"
                                            value={selectedAllocationMethod}
                                            onChange={handleAllocationMethodChange}
                                            options={[
                                                { value: 'not_applicable', label: 'Not Applicable' },
                                                { value: 'by_qty', label: 'Appropriate by Qty' },
                                                { value: 'by_value', label: 'Appropriate by Value' }
                                            ]}
                                        />
                                        {formErrors.allocation_method && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.allocation_method}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Label className="mb-0">Group behaves like a sub-ledger</Label>
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="subledgerSwitch"
                                                checked={formData.is_subledger}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        is_subledger: e.target.checked
                                                    }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="subledgerSwitch">
                                                {formData.is_subledger ? "Yes" : "No"}
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Label className="mb-0">Nett Debit/credit balances for reporting</Label>
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="nettBalancesSwitch"
                                                checked={formData.nett_balances}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        nett_balances: e.target.checked
                                                    }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="nettBalancesSwitch">
                                                {formData.nett_balances ? "Yes" : "No"}
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Label className="mb-0">Used For Calculation</Label>
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="calculationSwitch"
                                                checked={formData.used_for_calculation}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        used_for_calculation: e.target.checked
                                                    }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="calculationSwitch">
                                                {formData.used_for_calculation ? "Yes" : "No"}
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <div className="mt-3">
                                <Button
                                    type="submit"
                                    className="btn-custom-theme"
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        </React.Fragment>
    );
};

export default GroupCreation;