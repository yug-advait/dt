import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, CardBody, Col, Form, Input, Label, Modal, Row, UncontrolledTooltip } from 'reactstrap';
import Select from 'react-select';
import { Link } from "react-router-dom";
import Breadcrumbs from 'components/Common/Breadcrumb';
import TableContainer from 'components/Common/TableContainer';
import Loader from 'components/Common/Loader';
import "../../../assets/scss/custom/pages/__loader.scss";
import { addVoucherType, deleteVoucherType, fetchVoucherType, updateVoucherType } from 'helpers/Api/api_voucherTypes';
import DeleteModal from 'components/Common/DeleteModal';

const voucherTypes = () => {
    const [modal, setModal] = useState(false);
    const [voucherType, setVoucherType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState();
    const [rowData, setRowData] = useState("");
    const [edit, setEdit] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [voucherPermission, setVoucherPermission] = useState();

    const [formErrors, setFormErrors] = useState({});
    const [errors, setErrors] = useState({});
    const [isActive, setIsActive] = useState(true);

    const [selectedType, setSelectedType] = useState({});
    const [selectedNumberingMethod, setSelectedNumberingMethod] = useState({});
    const [selectedBehaviour, setSelectedBehaviour] = useState({});
    const [formData, setFormData] = useState({
        name: "",

        type: "",
        abbreviation: "",
        activate_voucher: false,

        numbering_method: "",
        numbering_behavior: "",
        setAlterDetails: false,

        effectiveDates: false,
        zeroValuedTransactions: false,
        makeOptionalVoucher: false,
        voucherNarration: false,
        enableDefaultAllocations: false,
        whatsappAfterSaving: false,

        printAfterSaving: false,
        nameOfClass: "",

        isactive: isActive,
    });

    const getVoucherTypes = async () => {
        try {
            setLoading(false); // false for now only
            const data = await fetchVoucherType();
            setVoucherType(data);
            setLoading(false);
        } catch (error) {
            console.error("Error in getVoucherType:", error);
            setLoading(false);
        }
    }

    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    }

    useEffect(() => {
        const userData = getUserData();
        var permissions = userData?.permissionList?.filter(
            permission =>
                permission.sub_menu_name === "voucher_type"
        );
        setVoucherPermission(
            permissions.find(permission => permission.sub_menu_name === "voucher_type")
        );
        getVoucherTypes();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [toast]);

    const handleClicks = () => {
        setFormData({
            name: "",

            type: "",
            abbreviation: "",
            activate_voucher: false,

            numbering_method: "",
            numbering_behavior: "",
            setAlterDetails: false,

            effectiveDates: false,
            zeroValuedTransactions: false,
            makeOptionalVoucher: false,
            voucherNarration: false,
            enableDefaultAllocations: false,
            whatsappAfterSaving: false,

            printAfterSaving: false,

            isactive: true,
        });
        setModal(true);
    };

    const onClickDelete = (item) => {
        setRowData(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            await deleteVoucherType(rowData.id);
            setToastMessage("Voucher Type Deleted Successfully");
            setToast(true);
            getVoucherTypes();
            setDeleteModal(false);
        } catch (error) {
            console.error("Error deleting data:", error);
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        let newValue = value;

        // if (name === 'name' && value.length > 10) {
        //     newValue = value.slice(0, 10);
        //     setFormErrors({
        //         ...formErrors,
        //         name: "Name cannot be more than 10 characters"
        //     });
        // } else {
        //     setFormErrors({
        //         ...formErrors,
        //         name: ""
        //     });
        // }

        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = "Name is required";
        }
        if (!formData.type) {
            errors.type = "Type is required";
        }
        if (!formData.abbreviation) {
            errors.abbreviation = "Abbreviation is required";
        }
        if (!formData.numbering_method) {
            errors.numbering_method = "Method of Voucher Numbering is required";
        }
        if (!formData.numbering_behavior) {
            errors.numbering_behavior = "Numbering Behavior is required";
        }
        if (!formData.nameOfClass) {
            errors.nameOfClass = "Name Of Class is required";
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
            if (edit) {
                const Id = edit.id;
                const Data = {
                    ...formData,
                    isactive: isActive,
                };
                await updateVoucherType(Id, Data);
                setToastMessage("Voucher Type Updated Successfully");
            } else {
                const Data = {
                    ...formData,
                    isactive: isActive,
                };
                await addVoucherType(Data);
                setToastMessage("Voucher Type Added Successfully");
            }
            setToast(true);
            getVoucherTypes();
            setModal(false);
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

            type: data?.type || "",
            abbreviation: data?.abbreviation || "",
            activate_voucher: data?.activate_voucher || false,

            numbering_method: data?.numbering_method || "",
            numbering_behavior: data?.numbering_method || "",
            setAlterDetails: data?.setAlterDetails || false,

            effectiveDates: data?.effectiveDates || false,
            zeroValuedTransactions: data?.zeroValuedTransactions || false,
            makeOptionalVoucher: data?.makeOptionalVoucher || false,
            voucherNarration: data?.voucherNarration || false,
            enableDefaultAllocations: data?.enableDefaultAllocations || false,
            whatsappAfterSaving: data?.whatsappAfterSaving || false,

            printAfterSaving: data?.printAfterSaving || false,
            nameOfClass: data?.nameOfClass || "",

            isactive: data?.isactive || true,
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

    const handleTypeChange = (selectedOption) => {
        setSelectedType(selectedOption);
        setFormData(prev => ({
            ...prev,
            type: selectedOption?.value || ""
        }));
    };

    const handleNumberingMethodChange = (selectedOption) => {
        setSelectedNumberingMethod(selectedOption);
        setFormData(prev => ({
            ...prev,
            numbering_method: selectedOption?.value || ""
        }));
    };

    const handleNumberingBehaviorChange = (selectedOption) => {
        setSelectedBehaviour(selectedOption);
        setFormData(prev => ({
            ...prev,
            numbering_behavior: selectedOption?.value || ""
        }));
    };

    const columns = useMemo(
        () => [
            {
                Header: "Voucher Name",
                accessor: "name",
            },
            {
                Header: "Actions",
                accessor: "action",
                disableFilters: true,
                Cell: cellProps => {
                    return (
                        <div className="d-flex gap-3">
                            {voucherPermission && voucherPermission?.can_edit ? (
                                <Link
                                    to="#"
                                    className="text-success"
                                    onClick={() => openModal(cellProps.row.original)}
                                >
                                    <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                    <UncontrolledTooltip placement="top" target="edittooltip">
                                        Edit
                                    </UncontrolledTooltip>
                                </Link>
                            ) : null}

                            {voucherPermission && voucherPermission?.can_delete ? (
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
        [voucherPermission]
    );

    document.title = "Detergent | Voucher Types";

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
                        title="Accounting"
                        breadcrumbItem={<>Voucher Types</>}
                        showBackButton={false}
                    />
                    {loading ? (
                        <Loader />
                    ) : (
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <TableContainer
                                            columns={columns}
                                            data={voucherType && voucherType.length > 0 ? voucherType : []}
                                            isGlobalFilter={true}
                                            isAddOptions={true}
                                            customPageSize={10}
                                            className="custom-header-css"
                                            addButtonLabel={
                                                voucherPermission && voucherPermission?.can_add
                                                ? "Add Voucher Type"
                                                : null
                                            }
                                            handleClicks={handleClicks}
                                            filterStateWise={true}
                                            loading={loading}
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </div>
                <Modal isOpen={modal} centered style={{ maxWidth: "1000px", width: "90%" }}>
                    <div className="modal-header">
                        {edit ? "Edit" : "Add"}
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
                                <Col>
                                    <Col md={12} className="mb-3">
                                        <div className="">
                                            <Label htmlFor="formrow-state-Input">Name</Label>
                                            <Input
                                                type="text"
                                                name="name"
                                                className={`form-control ${formErrors.name ? "is-invalid" : ""
                                                    }`}
                                                id="formmessage"
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
                                    <Col md={12} className="">
                                        <h5 className="">Printing :</h5>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Print vouchers after saving </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="printAfterSaving"
                                                    checked={formData.printAfterSaving}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            printAfterSaving: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="printAfterSaving">
                                                    {formData.printAfterSaving ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={12} className="">
                                        <h5 className="">Name of Class :</h5>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <div className="">
                                            <Input
                                                type="text"
                                                name="nameOfClass"
                                                className={`form-control ${formErrors.nameOfClass ? "is-invalid" : ""
                                                    }`}
                                                id="formmessage"
                                                placeholder="Please Enter Name of Class"
                                                value={formData?.nameOfClass}
                                                onChange={handleChange}
                                            />
                                            {formErrors.nameOfClass && (
                                                <div className="invalid-feedback">
                                                    {formErrors.nameOfClass}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                </Col>
                                <Col>
                                    <Col md={12} className="">
                                        <h5 className="">General :</h5>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="">
                                            <Label htmlFor="type">Select Type of Voucher</Label>
                                            <Select
                                                id="type"
                                                value={selectedType}
                                                onChange={handleTypeChange}
                                                options={[
                                                    { value: 'state1', label: 'State 1' },
                                                    { value: 'state2', label: 'State 2' }
                                                ]}
                                            />
                                            {formErrors.type && (
                                                <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                    {formErrors.type}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <div className="">
                                            <Label htmlFor="formrow-state-Input">Abbreviation</Label>
                                            <Input
                                                type="text"
                                                name="abbreviation"
                                                className={`form-control ${formErrors.abbreviation ? "is-invalid" : ""
                                                    }`}
                                                id="formmessage"
                                                placeholder="Please Enter Abbreviation"
                                                value={formData?.abbreviation}
                                                onChange={handleChange}
                                            />
                                            {formErrors.abbreviation && (
                                                <div className="invalid-feedback">
                                                    {formErrors.abbreviation}
                                                </div>
                                            )}
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Activate this Voucher Type</Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="activateVoucher"
                                                    checked={formData.activate_voucher}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            activate_voucher: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="assesseeSwitch">
                                                    {formData.activate_voucher ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Label htmlFor="numbering_method">Method of Voucher Numbering</Label>
                                        <Select
                                            id="numbering_method"
                                            value={selectedNumberingMethod}
                                            onChange={handleNumberingMethodChange}
                                            options={[
                                                { value: 'A', label: 'Method A' },
                                                { value: 'B', label: 'Method B' },
                                                { value: 'C', label: 'Method C' }
                                            ]}
                                        />
                                        {formErrors.numbering_method && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.numbering_method}
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={12} className="mb-3">
                                        <Label htmlFor="numbering_behavior">Numbering behavior on intersection/deletion</Label>
                                        <Select
                                            id="numbering_behavior"
                                            value={selectedBehaviour}
                                            onChange={handleNumberingBehaviorChange}
                                            options={[
                                                { value: 'A', label: 'Behaviour A' },
                                                { value: 'B', label: 'Behaviour B' },
                                                { value: 'C', label: 'Behaviour C' }
                                            ]}
                                        />
                                        {formErrors.numbering_behavior && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.numbering_behavior}
                                            </div>
                                        )}
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Set/Alter additional numbering details </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="setAlterDetails"
                                                    checked={formData.setAlterDetails}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            setAlterDetails: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="setAlterDetails">
                                                    {formData.setAlterDetails ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Show unused vch nos. in transactions for </Label>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Retain original voucher no behaviour </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="setAlterDetails"
                                                    checked={formData.setAlterDetails}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            setAlterDetails: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="setAlterDetails">
                                                    {formData.setAlterDetails ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Use effective dates for vouchers </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="effectiveDates"
                                                    checked={formData.effectiveDates}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            effectiveDates: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="effectiveDates">
                                                    {formData.effectiveDates ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Allow zero-valued transactions </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="zeroValuedTransactions"
                                                    checked={formData.zeroValuedTransactions}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            zeroValuedTransactions: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="zeroValuedTransactions">
                                                    {formData.zeroValuedTransactions ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Make this voucher type as &#39;Optional&#39; by default </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="makeOptionalVoucher"
                                                    checked={formData.makeOptionalVoucher}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            makeOptionalVoucher: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="makeOptionalVoucher">
                                                    {formData.makeOptionalVoucher ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Allow narration in voucher </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="voucherNarration"
                                                    checked={formData.voucherNarration}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            voucherNarration: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="voucherNarration">
                                                    {formData.voucherNarration ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">Enable default accounting allocations </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="enableDefaultAllocations"
                                                    checked={formData.enableDefaultAllocations}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            enableDefaultAllocations: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="enableDefaultAllocations">
                                                    {formData.enableDefaultAllocations ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={10} className="mb-3">
                                        <div className="d-flex align-items-center justify-content-between">
                                            <Label className="mb-0">WhatsApp vouchers after saving </Label>
                                            <div className="form-check form-switch">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    id="whatsappAfterSaving"
                                                    checked={formData.whatsappAfterSaving}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            whatsappAfterSaving: e.target.checked
                                                        }));
                                                    }}
                                                />
                                                <label className="form-check-label" htmlFor="whatsappAfterSaving">
                                                    {formData.whatsappAfterSaving ? "Yes" : "No"}
                                                </label>
                                            </div>
                                        </div>
                                    </Col>
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
    )
}

export default voucherTypes