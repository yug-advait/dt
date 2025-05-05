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
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

// Import API service
import {
    fetchGstClassification,
    addGstClassification,
    updateGstClassification,
    deleteGstClassification,
} from "../../../helpers/Api/api_gstClassification";

const GSTClassification = () => {
    const [modal, setModal] = useState(false);
    const [gstClassification, setGstClassification] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    const [rowData, setRowData] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [gstClassificationPermission, setGstClassificationPermission] = useState();
    const [formData, setFormData] = useState({
        name: "",
        isactive: isActive,
        hsn_sac_details: "",
        hsn_sac_code: "",
        hsn_sac_description: "",
        gst_rate: "",
        gst_details: "",
        gst_tax_type: "",
    });

    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    };

    const userData = getUserData();

    const getGstClassification = async () => {
        const id = userData?.user?.id
        try {
            setLoading(true);
            const data = await fetchGstClassification(id);
            setGstClassification(data);
            setLoading(false);
        } catch (error) {
            console.error("Error in getGstClassification:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = getUserData();
        var permissions = userData?.permissionList?.filter(
            permission =>
                permission.sub_menu_name === "gst_classification"
        );
        setGstClassificationPermission(
            permissions.find(permission => permission.sub_menu_name === "gst_classification")
        );
        getGstClassification();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [toast]);

    const handleClicks = async () => {
        setFormData({
            name: "",
            isactive: true,
            hsn_sac_details: "",
            hsn_sac_code: "",
            hsn_sac_description: "",
            gst_rate: "",
            gst_details: "",
            gst_tax_type: "",
        });
        setModal(true);
    };

    const onClickDelete = item => {
        setRowData(item);
        setDeleteModal(true);
    };

    const handleDelete = async () => {
        const data = {
            id: rowData.id,
            updatedby: userData?.user?.id,
        }
        try {
            await deleteGstClassification(data);
            setToastMessage("GST Classification Deleted Successfully");
            setToast(true);
            getGstClassification();
            setDeleteModal(false);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;

        let cleanValue = value;

        if (name === "gst_rate") {
            cleanValue = value.replace(/[^0-9.]/g, "");

            if (formData.gst_rate === "0" && cleanValue.length > 1) {
                cleanValue = cleanValue.replace(/^0/, "");
            }
        }

        setFormData({
            ...formData,
            [name]: cleanValue,
        });
    };

    const onGstRateKeyDown = (e) => {
        const input = e.currentTarget;
        const cursor_position = input.selectionStart;
        const isBackspace = e.key === "Backspace";
        const isDelete = e.key === "Delete";

        if ((isBackspace && cursor_position > 0 && input.value[cursor_position - 1] === '%') ||
            (isDelete && input.value[cursor_position] === '%')) {
            e.preventDefault();
            const newPos = Math.max(cursor_position - 1, 0);
            requestAnimationFrame(() => {
                input.setSelectionRange(newPos, newPos);
            });
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) {
            errors.name = "Name is required";
        }

        if (!formData.hsn_sac_details) {
            errors.hsn_sac_details = "HSN SAC Details is required";
        }

        if (formData.hsn_sac_details === '2') {
            if (!formData.hsn_sac_code) {
                errors.hsn_sac_code = "GSTIN/UIN is required";
            }

            if (!formData.hsn_sac_description) {
                errors.hsn_sac_description = "Description is required";
            }
        }

        if (!formData.gst_rate) {
            errors.gst_rate = "GST Rate is required";
        }

        if (!formData.gst_details) {
            errors.gst_details = "GST Rate Details is required";
        }

        if (!formData.gst_tax_type) {
            errors.gst_tax_type = "Taxability Type is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const HSN_SAC_OPTIONS = [
        { value: 'notDefined', label: 'Not Defined' },
        { value: 'specifyDetails', label: 'Specify Details Here' }
    ];

    const GST_DETAILS_OPTIONS = [
        { value: 'notDefined', label: 'Not Defined' },
        { value: 'specifyDetails', label: 'Specify Details Here' }
    ];

    const GST_TAX_TYPE_OPTIONS = [
        { value: 'exempt', label: 'Exempt' },
        { value: 'nilRated', label: 'Nil-Rated' },
        { value: 'nonGST', label: 'Non GST' },
        { value: 'taxable', label: 'Taxable' }
    ];

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
                    updatedby: userData?.user?.id,
                };
                await updateGstClassification(Id, Data);
                setToastMessage("GST Classification Updated Successfully");
            } else {
                const Data = {
                    ...formData,
                    isactive: isActive,
                    createdby: userData?.user?.id,
                };
                await addGstClassification(Data);
                setToastMessage("GST Classification Added Successfully");
            }
            setToast(true);
            setModal(false);
            getGstClassification();
            setEdit(null);
            resetForm();
        } catch (error) {
            console.error("Error saving/editing data:", error);
        }
    };

    const openModal = (data = null) => {
        setEdit(data);
        setRowData(data);
        setFormData({
            name: data?.name || "",
            isactive: data?.isactive || true,
            hsn_sac_details: data?.hsn_sac_details || "",
            hsn_sac_code: data?.hsn_sac_code || "",
            hsn_sac_description: data?.hsn_sac_description || "",
            gst_rate: data?.gst_rate || "",
            gst_details: data?.gst_details || "",
            gst_tax_type: data?.gst_tax_type || "",
        });

        setSelectedHsnSac(HSN_SAC_OPTIONS.find(opt => opt.value === data?.hsn_sac_details));
        setSelectedGstRateDetails(GST_DETAILS_OPTIONS.find(opt => opt.value === data?.gst_details));
        setSelectedGstTax(GST_TAX_TYPE_OPTIONS.find(opt => opt.value === data?.gst_tax_type));

        setModal(true);
        if (data) {
            setIsActive(data.isactive);
        }
    };

    const resetForm = () => {
        setFormErrors({})
        setErrors({});
        setEdit(null);
        setSelectedHsnSac(null);
        setSelectedGstRateDetails(null);
        setSelectedGstTax(null);
    };

    const [selectedHsnSac, setSelectedHsnSac] = useState({});

    const handleHSNsac = (selectedOption) => {
        setSelectedHsnSac(selectedOption);
        if (selectedOption.value === 'notDefined') {
            setFormData(prev => ({
                ...prev,
                hsn_sac_details: selectedOption.value,
                hsn_sac_code: '',
                hsn_sac_description: '',
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                hsn_sac_details: selectedOption.value,
            }));
        }
    };

    const [selectedGstRateDetails, setSelectedGstRateDetails] = useState({});

    const handleGstDetails = (selectedOption) => {
        setSelectedGstRateDetails(selectedOption);
        if (selectedOption.value === 'notDefined') {
            setSelectedGstTax(null);
            setFormData(prev => ({
                ...prev,
                gst_details: selectedOption.value,
                gst_rate: '0',
            }));
        } else {
            setSelectedGstTax({ value: 'nonGST', label: 'Non GST' });
            setFormData(prev => ({
                ...prev,
                gst_details: selectedOption.value,
                gst_rate: '0',
                gst_tax_type: 'nonGST'
            }));
        }
    };

    const [selectedGstTax, setSelectedGstTax] = useState({});

    const handleGstTax = (selectedOption) => {
        setSelectedGstTax(selectedOption);
        setFormData(prev => ({
            ...prev,
            gst_tax_type: selectedOption.value,
            gst_rate: '0',
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
                            {gstClassificationPermission && gstClassificationPermission?.can_edit ? (
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

                            {gstClassificationPermission && gstClassificationPermission?.can_delete ? (
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
        [gstClassificationPermission]
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
                    <Breadcrumbs titlePath="#" title="Statutory" breadcrumbItem="GST Classification" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={gstClassification && gstClassification.length > 0 ? gstClassification : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                gstClassificationPermission && gstClassificationPermission?.can_add
                                    ? "Add GST Classification"
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
                                <Col md={2} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="name">Name: </Label>
                                    </div>
                                </Col>
                                <Col md={10} className="mb-3">
                                    <div className="">
                                        <Input
                                            type="text"
                                            name="name"
                                            className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                                            id="name"
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
                            </Row>
                            <Row>
                                <Col md={12} className="">
                                    <h5 className="">HSN/SAC & Related Details :</h5>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="hsn_sac_details">HSN/SAC Details</Label>
                                        <Select
                                            id="hsn_sac_details"
                                            value={selectedHsnSac}
                                            onChange={handleHSNsac}
                                            options={HSN_SAC_OPTIONS}
                                        />
                                        {formErrors.hsn_sac_details && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.hsn_sac_details}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="hsn_sac_code">HSN/SAC</Label>
                                        <Input
                                            type="text"
                                            name="hsn_sac_code"
                                            className={`form-control ${formErrors.hsn_sac_code ? "is-invalid" : ""}`}
                                            id="hsn_sac_code"
                                            placeholder="Please Enter HSN/SAC"
                                            value={formData?.hsn_sac_code}
                                            onChange={handleChange}
                                            disabled={selectedHsnSac?.value === 'notDefined'}
                                        />
                                        {formErrors.hsn_sac_code && (
                                            <div className="invalid-feedback">
                                                {formErrors.hsn_sac_code}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="hsn_sac_description">Description</Label>
                                        <Input
                                            type="text"
                                            name="hsn_sac_description"
                                            className={`form-control ${formErrors.hsn_sac_description ? "is-invalid" : ""}`}
                                            id="hsn_sac_description"
                                            placeholder="Please Enter Description"
                                            value={formData?.hsn_sac_description}
                                            onChange={handleChange}
                                            disabled={selectedHsnSac?.value === 'notDefined'}
                                        />
                                        {formErrors.hsn_sac_description && (
                                            <div className="invalid-feedback">
                                                {formErrors.hsn_sac_description}
                                            </div>
                                        )}
                                    </div>
                                </Col>

                            </Row>

                            <Row>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="gst_details">GST Rate Details</Label>
                                        <Select
                                            id="gst_details"
                                            value={selectedGstRateDetails}
                                            onChange={handleGstDetails}
                                            options={GST_DETAILS_OPTIONS}
                                        />
                                        {formErrors.gst_details && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.gst_details}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="gst_tax_type">Taxability Type</Label>
                                        <Select
                                            id="gst_tax_type"
                                            value={selectedGstTax}
                                            onChange={handleGstTax}
                                            isDisabled={selectedGstRateDetails?.value === 'notDefined'}
                                            options={GST_TAX_TYPE_OPTIONS}
                                        />
                                        {formErrors.gst_tax_type && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.gst_tax_type}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <div className="">
                                        <Label htmlFor="gst_rate">GST Rate</Label>
                                        <Input
                                            type="text"
                                            name="gst_rate"
                                            className={`form-control ${formErrors.gst_rate ? "is-invalid" : ""}`}
                                            id="gst_rate"
                                            placeholder="Please Enter GST Username"
                                            value={formData?.gst_rate ? `${formData.gst_rate}%` : ""}
                                            onChange={handleChange}
                                            onKeyDown={onGstRateKeyDown}
                                            disabled={selectedGstRateDetails?.value === 'notDefined' ||
                                                selectedGstTax?.value === 'exempt' || selectedGstTax?.value === 'nilRated' || selectedGstTax?.value === 'nonGST'}
                                        />
                                        {formErrors.gst_rate && (
                                            <div className="invalid-feedback">
                                                {formErrors.gst_rate}
                                            </div>
                                        )}
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

export default GSTClassification;