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
import { Link, useLocation } from "react-router-dom"
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
    GET_INCO_TERMS_REQUEST,
    ADD_INCO_TERMS_REQUEST,
    UPDATE_INCO_TERMS_REQUEST,
    DELETE_INCO_TERMS_REQUEST,
} from "../../../store/incoTerms/actionTypes";
import { STATUS_REQUEST } from "../../../store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";
const IncoTerm = () => {

    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [incoTermRow, setIncoTermRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [incoTermsPermission, setIncoTermsPermission] = useState();
    const [formData, setFormData] = useState({
        inco_term: "",
        version: "",
        inco_term1: "",
        inco_term2: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { listIncoTerm, incoTerms, addIncoTerm, updateIncoTerm, deleteIncoTerm, error } = useSelector(
        state => state.incoTerms || {}
    );

    const { updateCommon } = useSelector(state => state.commons);

    const location = useLocation();

    const getUserData = () => {
        if (localStorage.getItem("authUser")) {
            const obj = JSON.parse(localStorage.getItem("authUser"));
            return obj;
        }
    };

    useEffect(() => {
        const userData = getUserData();
        const incoTerms = location.pathname == "/vendor/inco_terms" ? 'vendors_inco_terms' : 'customers_inco_terms'
        var permissions = userData?.permissionList?.filter(
            permission =>
                permission.sub_menu_name === incoTerms
        );
        setIncoTermsPermission(
            permissions.find(permission => permission.sub_menu_name === incoTerms)
        );
        dispatch({
            type: GET_INCO_TERMS_REQUEST,
            payload: { inco_term_type: location.pathname == "/vendor/inco_terms" ? 'v' : 'c' },
        });
    }, []);

    useEffect(() => {
        if (listIncoTerm) {
            setLoading(false)
        }
        if (addIncoTerm) {
            setToastMessage("Inco Term Added Successfully");
            dispatch({
                type: GET_INCO_TERMS_REQUEST,
                payload: { inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (updateIncoTerm) {
            setToastMessage("Inco Term Updated Successfully");
            dispatch({
                type: GET_INCO_TERMS_REQUEST,
                payload: { inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (deleteIncoTerm) {
            setToastMessage("Inco Term Deleted Successfully");
            dispatch({
                type: GET_INCO_TERMS_REQUEST,
                payload: { inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c' },
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Inco Term Status Updated Successfully");
            dispatch({
                type: STATUS_REQUEST,
            });
            dispatch({
                type: GET_INCO_TERMS_REQUEST,
                payload: { inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c' },
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listIncoTerm, addIncoTerm, updateIncoTerm, deleteIncoTerm, updateCommon, toast]);

    const handleClicks = async () => {
        setFormData({
            inco_term: "",
            version: "",
            inco_term1: "",
            inco_term2: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setIncoTermRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {

        const incoTermsData = {
            Id: incoTermRow.id,
            inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c',
        }

        try {
            dispatch({
                type: DELETE_INCO_TERMS_REQUEST,
                payload: incoTermsData
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

        if (name === 'inco_term' && value.length > 5) {
            newValue = value.slice(0, 5);
            setFormErrors({
                ...formErrors,
                inco_term: "Inco Term cannot be more than 5 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                inco_term: ""
            });
        }

        if (name === 'inco_term1' && value.length > 50) {
            newValue = value.slice(0, 50);
            setFormErrors({
                ...formErrors,
                inco_term1: "Inco Term 1 cannot be more than 50 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                inco_term1: ""
            });
        }

        if (name === 'inco_term2' && value.length > 50) {
            newValue = value.slice(0, 50);
            setFormErrors({
                ...formErrors,
                inco_term2: "Inco Term 2 cannot be more than 50 characters"
            });
        } else {

            setFormErrors({
                ...formErrors,
                inco_term2: ""
            });
        }
        if (name === 'version' && value.length > 50) {
            setFormErrors({
              ...formErrors,
              version: "Version cannot be more than 50 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              version: ""
            });
          }

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.inco_term.trim()) {
            errors.inco_term = "Inco Term is required.";
        } else if (formData.inco_term.length > 5) {
            errors.inco_term = "Inco Term cannot be more than 5 characters"
        }
        if (!formData.version.trim()) {
            errors.version = "Version is required.";
        }
        else if (formData.version.length > 50) {
            errors.version = "Version cannot be more than 50 characters"
        }
        if (!formData.inco_term1.trim()) {
            errors.inco_term1 = "Inco Term 1 is required.";
        }else if (formData.inco_term1.length > 50) {
            errors.inco_term1 = "Inco Term 1 cannot be more than 50 characters"
        }
        if (!formData.inco_term2.trim()) {
            errors.inco_term2 = "Inco Term 2 is required.";
        }else if (formData.inco_term2.length > 50) {
            errors.inco_term2 = "Inco Term 2 cannot be more than 50 characters"
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
                const incoTermData = {
                    formData,
                    inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c',
                    Id
                };

                dispatch({
                    type: UPDATE_INCO_TERMS_REQUEST,
                    payload: incoTermData
                });
            }
            else {
                const incoTermData = {
                    formData,
                    inco_term_type: location.pathname == '/vendor/inco_terms' ? 'v' : 'c',
                };

                dispatch({
                    type: ADD_INCO_TERMS_REQUEST,
                    payload: incoTermData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing Inco Terms : ", error);
        }
    }

    // Open Modal
    const openModal = (data = null) => {
        setEdit(data);
        setIncoTermRow(data);
        setFormData({
            inco_term: data?.inco_term,
            version: data?.version,
            inco_term1: data?.inco_term1,
            inco_term2: data?.inco_term2,
            isactive: isActive,
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
            Header: "Inco Term",
            accessor: "inco_term"
        },
        {
            Header: "Version",
            accessor: "version"
        },
        {
            Header: "Inco Term1",
            accessor: "inco_term1"
        },
        {
            Header: "Inco Term2",
            accessor: "inco_term2"
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
                                            name: "inco_terms",
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
                        {incoTermsPermission && incoTermsPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}

                        {incoTermsPermission && incoTermsPermission?.can_delete ? (
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
        }], [status, incoTermsPermission]);

    document.title = "Detergent | Inco Terms";

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

                    <Breadcrumbs titlePath="#" title={location.pathname === "/vendor/inco_terms" ? 'Vendor' : 'Customer'}
                        breadcrumbItem="Inco Terms" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={incoTerms && incoTerms.length > 0 ? incoTerms : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                incoTermsPermission && incoTermsPermission?.can_add
                                    ? "Add Inco Terms"
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
                                        <Label htmlFor="formrow-state-Input">Inco Term</Label>
                                        <Input
                                            type="text"
                                            name="inco_term"
                                            className={`form-control ${formErrors.inco_term ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Inco Term"
                                            value={formData?.inco_term}
                                            onChange={handleChange}
                                        />
                                        {formErrors.inco_term && (
                                            <div className="invalid-feedback">
                                                {formErrors.inco_term}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Version</Label>
                                        <Input
                                            type="text"
                                            name="version"
                                            className={`form-control ${formErrors.version ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Version"
                                            value={formData?.version}
                                            onChange={handleChange}
                                        />
                                        {formErrors.version && (
                                            <div className="invalid-feedback">
                                                {formErrors.version}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Inco Term1</Label>
                                        <Input
                                            type="text"
                                            name="inco_term1"
                                            className={`form-control ${formErrors.inco_term1 ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Inco Term1"
                                            value={formData?.inco_term1}
                                            onChange={handleChange}
                                        />
                                        {formErrors.inco_term1 && (
                                            <div className="invalid-feedback">
                                                {formErrors.inco_term1}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Inco Term2</Label>
                                        <Input
                                            type="text"
                                            name="inco_term2"
                                            className={`form-control ${formErrors.inco_term2 ? "is-invalid" : ""}`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Inco Term2"
                                            value={formData?.inco_term2}
                                            onChange={handleChange}
                                        />
                                        {formErrors.inco_term2 && (
                                            <div className="invalid-feedback">
                                                {formErrors.inco_term2}
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

export default IncoTerm;