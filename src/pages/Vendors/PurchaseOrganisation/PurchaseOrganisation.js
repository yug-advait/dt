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
    GET_PURCHASE_ORGANISATION_REQUEST,
    ADD_PURCHASE_ORGANISATION_REQUEST,
    UPDATE_PURCHASE_ORGANISATION_REQUEST,
    DELETE_PURCHASE_ORGANISATION_REQUEST,
} from "../../../store/purchaseOrganisation/actionTypes";
import { STATUS_REQUEST, UPDATE_STATUS_RESET } from "../../../store/common/actionTypes";
import { getSelectData } from "helpers/Api/api_common";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const PurchaseOrganisation = () => {

    const [modal, setModal] = useState(false);
    const [toast, setToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [purchaseOrganisationRow, setPurchaseOrganisationRow] = useState("");
    const [toastMessage, setToastMessage] = useState();
    const [optionCompany, setOptionCompany] = useState([]);
    const [selectCompany, setSelectedCompany] = useState({});
    const [inputCompanyValue, setInputCompanyValue] = useState('');
    const [optionPlant, setOptionPlant] = useState([]);
    const [selectPlant, setSelectedPlant] = useState({});
    const [inputPlantValue, setInputPlantValue] = useState('');
    const [optionPurchaseGroup, setOptionPurchaseGroup] = useState([]);
    const [selectPurchaseGroup, setSelectedPurchaseGroup] = useState({});
    const [inputPurchaseGroupValue, setInputPurchaseGroupValue] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [formErrors, setFormErrors] = useState({});
    const [status, setStatus] = useState("");
    const [Edit, setEdit] = useState(null);
    const [purchaseorgPermission, setpurchaseorgPermission] = useState();
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        purchase_organisation: "",
        company_id: "",
        plant_id: "",
        purchase_group_id: "",
        isactive: isActive
    });

    const dispatch = useDispatch();

    const { listPurchaseOrganisation, purchaseOrganisations, addPurchaseOrganisation, updatePurchaseOrganisation, deletePurchaseOrganisation, error } = useSelector(
        state => state.purchaseOrganisations || {}
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
                permission.sub_menu_name === "purchase_organisation"
        );
        setpurchaseorgPermission(
            permissions.find(permission => permission.sub_menu_name === "purchase_organisation")
        );
        dispatch({
            type: GET_PURCHASE_ORGANISATION_REQUEST,
            payload: [],
        });
    }, []);

    useEffect(() => {
        if (listPurchaseOrganisation) {
            setLoading(false)
        }
        if (addPurchaseOrganisation) {
            setToastMessage("Purchase Organisation Added Successfully");
            dispatch({
                type: GET_PURCHASE_ORGANISATION_REQUEST,
            });
            setToast(true);
        }
        if (updatePurchaseOrganisation) {
            setToastMessage("Purchase Organisation Updated Successfully");
            dispatch({
                type: GET_PURCHASE_ORGANISATION_REQUEST,
            });
            setToast(true);
        }
        if (deletePurchaseOrganisation) {
            setToastMessage("Purchase Organisation Deleted Successfully");
            dispatch({
                type: GET_PURCHASE_ORGANISATION_REQUEST,
            });
            setToast(true);
        }
        if (updateCommon) {
            setToastMessage("Purchase Organisation Status Updated Successfully");
            dispatch({
                type: UPDATE_STATUS_RESET,
            });
            dispatch({
                type: GET_PURCHASE_ORGANISATION_REQUEST,
            });
            setToast(true);
        }
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }, [listPurchaseOrganisation, addPurchaseOrganisation, updatePurchaseOrganisation, deletePurchaseOrganisation, updateCommon, toast]);

    const handleClicks = async () => {
        const selectCompanyData = await getSelectData('company_name', "", 'company_legal_entity')
        setOptionCompany(selectCompanyData?.getDataByColNameData);
        const selectPlantData = await getSelectData('plant_code', "", 'warehouse_master');
        setOptionPlant(selectPlantData?.getDataByColNameData);
        const selectPurchaseGroupData = await getSelectData('purchase_group_description', "", 'purchase_group');
        setOptionPurchaseGroup(selectPurchaseGroupData?.getDataByColNameData);
        setSelectedCompany({});
        setSelectedPlant({});
        setSelectedPurchaseGroup({});
        setFormData({
            purchase_organisation: "",
            company_id: "",
            plant_id: "",
            purchase_group_id: "",
            isactive: true
        })
        setModal(true)
    };

    const onClickDelete = item => {
        setPurchaseOrganisationRow(item);
        setDeleteModal(true);
    }

    const handleDelete = async () => {
        try {
            dispatch({
                type: DELETE_PURCHASE_ORGANISATION_REQUEST,
                payload: purchaseOrganisationRow.id
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

    const handlePlantInputChange = useCallback(
        debounce(async (inputPlantValue) => {
            try {
                const selectData = await getSelectData('plant_code', inputPlantValue, 'warehouse_master');
                setOptionPlant(selectData?.getDataByColNameData);
            }
            catch (error) {
                console.error('Error in fetching data : ', error);
            }
        }, 300), []
    );

    const handlePurchaseGroupInputChange = useCallback(
        debounce(async (inputPurchaseGroupValue) => {
            try {
                const selectData = await getSelectData('purchase_group_description', inputPurchaseGroupValue, 'purchase_group');
                setOptionPurchaseGroup(selectData?.getDataByColNameData);
            }
            catch (error) {
                console.error('Error in fetching data : ', error);
            }
        }, 300), []
    );

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === 'purchase_organisation' && value.length > 50) {
            setFormErrors({
              ...formErrors,
              purchase_organisation: "Purchase Organisation cannot be more than 50 characters"
            });
          }else {
            setFormErrors({
              ...formErrors,
              purchase_organisation: ""
            });
          }
        setFormData({
            ...formData,
            [name]: value,
        });
    }

    const validateForm = () => {
        const errors = {};

        if (!formData.purchase_organisation.trim()) {
            errors.purchase_organisation = "Purchase Organisation is required.";
        }
        else if (formData.purchase_organisation.length > 50) {
            errors.purchase_organisation = "Purchase Organisation cannot be more than 50 characters"
          }
        if (Object.keys(selectCompany).length === 0) {
            errors.company = 'Company Name is required.'
        }
        if (Object.keys(selectPlant).length === 0) {
            errors.plant = 'Plant Name is required.'
        }
        if (Object.keys(selectPurchaseGroup).length === 0) {
            errors.purchasegroup = 'Purchase Group is required.'
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
                const purchaseOrganisationsData = {
                    formData,
                    selectCompany,
                    selectPlant,
                    selectPurchaseGroup,
                    Id
                };

                dispatch({
                    type: UPDATE_PURCHASE_ORGANISATION_REQUEST,
                    payload: purchaseOrganisationsData
                });
            }
            else {
                const purchaseOrganisationsData = {
                    formData,
                    selectCompany,
                    selectPlant,
                    selectPurchaseGroup,
                };

                dispatch({
                    type: ADD_PURCHASE_ORGANISATION_REQUEST,
                    payload: purchaseOrganisationsData
                })
            }
            setModal(false);
            setEdit(null);
            resetForm();
        }
        catch (error) {
            console.error("Error in saving/editing purchaseOrganisation : ", error);
        }
    }

    const openModal = (data = null) => {
        setEdit(data);
        setSelectedCompany(data?.company);
        setSelectedPlant(data?.plant);
        setSelectedPurchaseGroup(data?.purchasegroup);
        setPurchaseOrganisationRow(data);
        setFormData({
            purchase_organisation: data?.purchase_organisation,
            company_id: data?.company_id,
            plant_id: data?.plant_id,
            purchase_group_id: data?.purchase_group_id,
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
            Header: "Purchase Organisation",
            accessor: "purchase_organisation"
        },
        {
            Header: "Company",
            accessor: "company.label"
        },
        {
            Header: "Plant",
            accessor: "plant.label"
        },
        {
            Header: "Purchase Group",
            accessor: "purchasegroup.label"
        },
        {
            Header: "Created On",
            accessor: "createdon",
            Cell: ({ value }) => {
                const formattedDate = value && moment(value).format('DD/MM/YYYY');
                return <div>{formattedDate}</div>
            },
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
                                            name: "purchase_organisation",
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
                        {purchaseorgPermission && purchaseorgPermission?.can_edit ? (
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => openModal(cellProps.row.original)}>
                                <i className="mdi mdi-pencil-box font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">Edit</UncontrolledTooltip>
                            </Link>
                        ) : null}
                        {purchaseorgPermission && purchaseorgPermission?.can_delete ? (
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
        }], [status, purchaseorgPermission]);

    document.title = "Detergent | PurchaseOrganisation";

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

                    <Breadcrumbs titlePath="#" title="Master" breadcrumbItem="Purchase Organisation" />

                    {loading ? (
                        <Loader />
                    ) : (
                        <TableContainer
                            columns={columns}
                            data={purchaseOrganisations && purchaseOrganisations.length > 0 ? purchaseOrganisations : []}
                            isGlobalFilter={true}
                            isAddOptions={true}
                            customPageSize={10}
                            className="custom-header-css"
                            addButtonLabel={
                                purchaseorgPermission && purchaseorgPermission?.can_add
                                    ? "Add Purchase Organisation"
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
                                        <Label htmlFor="formrow-state-Input">Purchase Organisation</Label>
                                        <Input
                                            type="text"
                                            name="purchase_organisation"
                                            className={`form-control ${formErrors.purchase_organisation ? "is-invalid" : ""
                                                }`}
                                            id="formrow-state-Input"
                                            placeholder="Please Enter Purchase Organisation"
                                            value={formData?.purchase_organisation}
                                            onChange={handleChange}
                                        />
                                        {formErrors.purchase_organisation && (
                                            <div className="invalid-feedback">
                                                {formErrors.purchase_organisation}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
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
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Plant Name</Label>
                                        <Select
                                            value={selectPlant}
                                            onChange={(selectPlant) => setSelectedPlant(selectPlant)}
                                            onInputChange={(inputPlantValue, { action }) => {
                                                setInputPlantValue(inputPlantValue);
                                                handlePlantInputChange(inputPlantValue);
                                            }}
                                            options={optionPlant}
                                        />
                                        {formErrors.plant && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.plant}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={12} className="mb-3">
                                    <div className="mb-3">
                                        <Label htmlFor="formrow-state-Input">Purchase Group</Label>
                                        <Select
                                            value={selectPurchaseGroup}
                                            onChange={(selectPurchaseGroup) => setSelectedPurchaseGroup(selectPurchaseGroup)}
                                            onInputChange={(inputPurchaseGroupValue, { action }) => {
                                                setInputPurchaseGroupValue(inputPurchaseGroupValue);
                                                handlePurchaseGroupInputChange(inputPurchaseGroupValue);
                                            }}
                                            options={optionPurchaseGroup}
                                        />
                                        {formErrors.purchasegroup && (
                                            <div style={{ color: '#f46a6a', fontSize: '80%' }}>
                                                {formErrors.purchasegroup}
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

export default PurchaseOrganisation;