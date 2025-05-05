import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, CardBody, Col, Form, Input, Label, Modal, Row, UncontrolledTooltip } from 'reactstrap';
import { Link } from "react-router-dom";
import Breadcrumbs from 'components/Common/Breadcrumb';
import TableContainer from 'components/Common/TableContainer';
import Loader from 'components/Common/Loader';
import "../../../assets/scss/custom/pages/__loader.scss";
import DeleteModal from 'components/Common/DeleteModal';
import { addBankData, deleteBankData, fetchBankData, updateBankData } from 'helpers/Api/api_banking';

const bank = () => {
    const [modal, setModal] = useState(false);
    const [bankData, setBankData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState();
    const [rowData, setRowData] = useState("");
    const [edit, setEdit] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const [bankingPermission, setBankingPermission] = useState();


    const [formErrors, setFormErrors] = useState({});
    const [errors, setErrors] = useState({});
    const [isActive, setIsActive] = useState(true);
    const [formData, setFormData] = useState({
        bankName: "",
        activate_voucher: false,
        isactive: isActive,
    });

    const getBankData = async () => {
        try {
            setLoading(true);
            const data = await fetchBankData();
            setBankData(data);
            setLoading(false);
        } catch (error) {
            console.log("Error fetching bank data:", error);
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
                permission.sub_menu_name === "banking"
        );
        setBankingPermission(
            permissions.find(permission => permission.sub_menu_name === "banking")
        )
        getBankData();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [toast]);

    const handleClicks = () => {
        setFormData({
            bankName: "",
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
            await deleteBankData(rowData.id);
            setToastMessage("Bank Deleted Successfully");
            setToast(true);
            getBankData();
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

        if (!formData.bankName) {
            errors.bankName = "Bank Name is required";
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
                await updateBankData(Id, Data);
                setToastMessage("Bank Updated Successfully");
            } else {
                const Data = {
                    ...formData,
                    isactive: isActive,
                };
                await addBankData(Data);
                setToastMessage("Bank Added Successfully");
            }
            setToast(true);
            getBankData();
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
            bankName: data?.bankName || "",
            // activate_voucher: data?.activate_voucher || false,
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

    const columns = useMemo(
        () => [
            {
                Header: "Bank Name",
                accessor: "bank_name",
            },
            {
                Header: "Status",
                accessor: "isactive",
                Cell: cellProps => {
                    return (
                        <div className="form-check form-switch mb-3" dir="ltr">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={cellProps.row.original.isactive}
                            // onClick={() => { }}
                            />
                        </div>
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
                            {bankingPermission && bankingPermission?.can_edit ? (
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

                            {bankingPermission && bankingPermission?.can_delete ? (
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
        [bankingPermission]
    );

    document.title = "Detergent | Banking";

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
                        breadcrumbItem={<>Banking</>}
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
                                            data={bankData && bankData.length > 0 ? bankData : []}
                                            isGlobalFilter={true}
                                            isAddOptions={true}
                                            customPageSize={10}
                                            className="custom-header-css"
                                            addButtonLabel={
                                                // bankingPermission && bankingPermission?.can_add
                                                // ? 
                                                "Add Bank"
                                                // : null
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
                <Modal isOpen={modal} centered>
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
                                <Col md={12} className="mb-3">
                                    <Label htmlFor="formmessage">Bank Name</Label>
                                    <Input
                                        type="text"
                                        name='bankName'
                                        id="formmessage"
                                        className={`form-control ${formErrors.bankName ? "is-invalid" : ""}`}
                                        value={formData?.bankName}
                                        placeholder="Enter your Bank Name"
                                        onChange={handleChange}
                                    />
                                    {formErrors.bankName && (
                                        <div className="invalid-feedback">
                                            {formErrors.bankName}
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

export default bank