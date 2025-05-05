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

const GSTRegistration = () => {
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
        registration_status: "",
        state: "",
        registration_type: "",
        assessee_other_territory: false,
        gstin_uin: "",
        gstr1_periodicity: "",
        gst_username: "",
        mode_of_filing: "",
        e_invoicing_applicable: false,
        tax_rate: "",
        calculate_tax_based_on: "",
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
            registration_status: "",
            state: "",
            registration_type: "",
            assessee_other_territory: false,
            gstin_uin: "",
            gstr1_periodicity: "",
            gst_username: "",
            mode_of_filing: "",
            e_invoicing_applicable: false,
            tax_rate: "",
            calculate_tax_based_on: "",
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
        if (!formData.registration_status) {
            errors.registration_status = "Registration Status is required";
        }
        if (!formData.state) {
            errors.state = "State is required";
        }
        if (!formData.registration_type) {
            errors.registration_type = "Registration Type is required";
        }
        if (!formData.gstin_uin) {
            errors.gstin_uin = "GSTIN/UIN is required";
        }
        if (formData.registration_type !== 'composition' && !formData.gstr1_periodicity) {
            errors.gstr1_periodicity = "Periodicity of GSTR-1 is required";
        }
        if (!formData.gst_username) {
            errors.gst_username = "GST Username is required";
        }
        if (!formData.mode_of_filing) {
            errors.mode_of_filing = "Mode of Filing is required";
        }
        if (formData.registration_type === 'composition') {
            if (!formData.tax_rate) {
                errors.tax_rate = "Tax Rate is required";
            }
            if (!formData.calculate_tax_based_on) {
                errors.calculate_tax_based_on = "Calculate Tax Based On is required";
            }
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
            registration_status: data?.registration_status || "",
            state: data?.state || "",
            registration_type: data?.registration_type || "",
            assessee_other_territory: data?.assessee_other_territory || false,
            gstin_uin: data?.gstin_uin || "",
            gstr1_periodicity: data?.gstr1_periodicity || "",
            gst_username: data?.gst_username || "",
            mode_of_filing: data?.mode_of_filing || "",
            e_invoicing_applicable: data?.e_invoicing_applicable || false,
            tax_rate: data?.tax_rate || "",
            calculate_tax_based_on: data?.calculate_tax_based_on || "",
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

    const [selectedRegistrationStatus, setSelectedRegistrationStatus] = useState({});
    const [selectedState, setSelectedState] = useState({});
    const [selectedRegistrationType, setSelectedRegistrationType] = useState({});
    const [selectedGSTR1Periodicity, setSelectedGSTR1Periodicity] = useState({});

    const handleRegistrationStatusChange = (selectedOption) => {
        setSelectedRegistrationStatus(selectedOption);
        setFormData(prev => ({
            ...prev,
            registration_status: selectedOption?.value || ""
        }));
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setFormData(prev => ({
            ...prev,
            state: selectedOption?.value || ""
        }));
    };

    const handleRegistrationTypeChange = (selectedOption) => {
        setSelectedRegistrationType(selectedOption);
        setFormData(prev => ({
            ...prev,
            registration_type: selectedOption?.value || ""
        }));
    };

    const handleGSTR1PeriodicityChange = (selectedOption) => {
        setSelectedGSTR1Periodicity(selectedOption);
        setFormData(prev => ({
            ...prev,
            gstr1_periodicity: selectedOption?.value || ""
        }));
    };

    const [selectedModeOfFiling, setSelectedModeOfFiling] = useState({});

    const handleModeOfFilingChange = (selectedOption) => {
        setSelectedModeOfFiling(selectedOption);
        setFormData(prev => ({
            ...prev,
            mode_of_filing: selectedOption?.value || ""
        }));
    };

    const [selectedCalculateTaxBasedOn, setSelectedCalculateTaxBasedOn] = useState({});

    const handleCalculateTaxBasedOnChange = (selectedOption) => {
        setSelectedCalculateTaxBasedOn(selectedOption);
        setFormData(prev => ({
            ...prev,
            calculate_tax_based_on: selectedOption?.value || ""
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

    document.title = "Detergent | GST Classification";
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
                    <Breadcrumbs titlePath="#" title="Statutory" breadcrumbItem="GST Registration" />

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
                                    ? "Add GST Registration"
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
                                <Col md={4} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="registration-status">Registration Status</Label>
                                        <Select
                                            id="registration-status"
                                            value={selectedRegistrationStatus}
                                            onChange={handleRegistrationStatusChange}
                                            options={[
                                                { value: 'active', label: 'Active' },
                                                { value: 'inactive', label: 'Inactive' }
                                            ]}
                                        />
                                        {formErrors.registration_status && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.registration_status}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                {/* <Col md={12} className="">
                                    <h5 className="">GST Registration Details :</h5>
                                </Col> */}
                                <Col md={4} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="state">State</Label>
                                        <Select
                                            id="state"
                                            value={selectedState}
                                            onChange={handleStateChange}
                                            options={[
                                                { value: 'state1', label: 'State 1' },
                                                { value: 'state2', label: 'State 2' }
                                            ]}
                                        />
                                        {formErrors.state && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.state}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="registration-type">Registration Type</Label>
                                        <Select
                                            id="registration-type"
                                            value={selectedRegistrationType}
                                            onChange={handleRegistrationTypeChange}
                                            options={[
                                                { value: 'regular', label: 'Regular' },
                                                { value: 'composition', label: 'Composition' },
                                                { value: 'regular_sez', label: 'Regular - SEZ' }
                                            ]}
                                        />
                                        {formErrors.registration_type && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.registration_type}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                
                                <Col md={4} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="gstin-uin">GSTIN / UIN</Label>
                                        <Input
                                            type="text"
                                            name="gstin_uin"
                                            className={`form-control ${formErrors.gstin_uin ? "is-invalid" : ""}`}
                                            id="gstin-uin"
                                            placeholder="Please Enter GSTIN/UIN"
                                            value={formData?.gstin_uin}
                                            onChange={handleChange}
                                        />
                                        {formErrors.gstin_uin && (
                                            <div className="invalid-feedback">
                                                {formErrors.gstin_uin}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                               
                                {formData.registration_type !== 'composition' && (
                                    <Col md={4} className="mb-3">
                                        <div className="mb-3">
                                            <Label htmlFor="gstr1-periodicity">Periodicity of GSTR-1</Label>
                                            <Select
                                                id="gstr1-periodicity"
                                                value={selectedGSTR1Periodicity}
                                                onChange={handleGSTR1PeriodicityChange}
                                                options={[
                                                    { value: 'monthly', label: 'Monthly' },
                                                    { value: 'quarterly', label: 'Quarterly' }
                                                ]}
                                            />
                                            {formErrors.gstr1_periodicity && (
                                                <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                    {formErrors.gstr1_periodicity}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    
                                )}

<Col md={4} className="mb-3">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <Label className="mb-0">Assessee of other Territory</Label>
                                        <div className="form-check form-switch">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="assesseeSwitch"
                                                checked={formData.assessee_other_territory}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        assessee_other_territory: e.target.checked
                                                    }));
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="assesseeSwitch">
                                                {formData.assessee_other_territory ? "Yes" : "No"}
                                            </label>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4} className="">
                                    <h5 className="">GST Details :</h5>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="gst-username">GST Username</Label>
                                        <Input
                                            type="text"
                                            name="gst_username"
                                            className={`form-control ${formErrors.gst_username ? "is-invalid" : ""}`}
                                            id="gst-username"
                                            placeholder="Enter Username"
                                            value={formData?.gst_username}
                                            onChange={handleChange}
                                        />
                                        {formErrors.gst_username && (
                                            <div className="invalid-feedback">
                                                {formErrors.gst_username}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={4} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="mode-of-filing">Mode of Filing</Label>
                                        <Select
                                            id="mode-of-filing"
                                            value={selectedModeOfFiling}
                                            onChange={handleModeOfFilingChange}
                                            options={[
                                                { value: 'not_applicable', label: 'Not Applicable' },
                                                { value: 'dsc', label: 'DSC' },
                                                { value: 'evc', label: 'EVC' }
                                            ]}
                                        />
                                        {formErrors.mode_of_filing && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.mode_of_filing}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            {formData.registration_type !== 'regular_sez' && formData.registration_type !== 'composition' && (
                                <Row>
                                    <Col md={5} className="">
                                        <h5 className="">E-Invoice Details :</h5>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">E-Invoicing Applicable</Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="eInvoicingSwitch"
                                                    checked={formData.e_invoicing_applicable}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            e_invoicing_applicable: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="eInvoicingSwitch">
                                                    {formData.e_invoicing_applicable ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            )}
                            {formData.registration_type !== 'regular' && formData.registration_type !== 'regular_sez' &&(
                            <Row>
                                <Col md={12} className="">
                                    <h5 className="">Tax Rate Details for Turnover :</h5>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="tax-rate">Tax Rate for Taxable turnover</Label>
                                        <Input
                                            type="number"
                                            name="tax_rate"
                                            className={`form-control ${formErrors.tax_rate ? "is-invalid" : ""}`}
                                            id="tax-rate"
                                            placeholder="Please Enter Tax Rate (%)"
                                            value={formData?.tax_rate}
                                            onChange={handleChange}
                                        />
                                        {formErrors.tax_rate && (
                                            <div className="invalid-feedback">
                                                {formErrors.tax_rate}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="calculate-tax-based-on">Calculate Tax based On</Label>
                                        <Select
                                            id="calculate-tax-based-on"
                                            value={selectedCalculateTaxBasedOn}
                                            onChange={handleCalculateTaxBasedOnChange}
                                            options={[
                                                { value: 'taxable_value', label: 'Taxable value' },
                                                { value: 'taxable_exempt_nil', label: 'Taxable, Exempt & Nil rated values' }
                                            ]}
                                        />
                                        {formErrors.calculate_tax_based_on && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.calculate_tax_based_on}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            )}
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

export default GSTRegistration;