import React, { useEffect, useMemo, useState,useCallback  } from "react";
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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import DeleteModal from "components/Common/DeleteModal";
import {
  ADD_SITESETTING_REQUEST,
  GET_SITESETTING_REQUEST,
  UPDATE_SITESETTING_REQUEST,
  DELETE_SITESETTING_REQUEST,
} from "../../../src/store/siteSetting/actionTypes";
import Select from "react-select";
import debounce from "lodash/debounce";
import { STATUS_REQUEST } from "../../../src/store/common/actionTypes";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
const siteSetting = () => {
   // Custom Styles
   const customStyles = {
    control: provided => ({
        ...provided,
        minHeight: "27px",
        height: "27px",
        fontSize: "0.875rem",
        padding: "0.25rem 0.5rem",
    }),

    valueContainer: provided => ({
        ...provided,
        padding: "0 0.5rem",
    }),

    input: provided => ({
        ...provided,
        margin: "0",
        padding: "0",
    }),

    indicatorSeparator: provided => ({
        ...provided,
        display: "none",
    }),

    dropdownIndicator: provided => ({
        ...provided,
        padding: "0",
    }),
};
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
   const aa= useSelector(
    state => state.site_setting
  );  

  const { siteSetting, addsiteSetting, updatesiteSetting, deletesiteSetting, error } = useSelector(
    state => state.site_setting
  );
  
  const { updateCommon } = useSelector(state => state.commons);
  const [toast, setToast] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [rowData, setRowData] = useState("")
  const [selectGatePassType, setSelectedGatePassType] = useState({});
  const [sitesettingPermission, setSitePermission] = useState();
  const [toastMessage, setToastMessage] = useState()
  const [isActive, setIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [Edit, setEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    key: "",
    value: "",
    identifier: "",
    isdeleted: "",
    id: "",
    createdby: "",
    isactive: isActive
  });

  const getUserData = () => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      return obj;
    }
  };

  useEffect( () => {
    dispatch({
      type: GET_SITESETTING_REQUEST,
      payload: [],
    });
  }, []);
  useEffect(() => {
    const userData = getUserData();
    var permissions = userData?.permissionList?.filter(
      permission =>
        permission.sub_menu_name === "site_settings"
    );
    setSitePermission(
      permissions.find(permission => permission.sub_menu_name === "site_settings")
    );
    dispatch({
      type: GET_SITESETTING_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (addsiteSetting) {
      setToastMessage("Site Setting Added Successfully");
      dispatch({
        type: GET_SITESETTING_REQUEST,
      });
      setToast(true);
    }
    if (updatesiteSetting) {
      setToastMessage("Site Setting Updated Successfully");
      dispatch({
        type: GET_SITESETTING_REQUEST,
      });
      setToast(true);
    }
    if (deletesiteSetting) {
      setToastMessage("Site Setting Deleted Successfully");
      dispatch({
        type: GET_SITESETTING_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Site Setting Status Updated Successfully");
      dispatch({
        type: STATUS_REQUEST,
      })
      dispatch({
        type: GET_SITESETTING_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addsiteSetting, updatesiteSetting, updateCommon, deletesiteSetting, toast]);

  const handleClicks = () => {
    setFormData({
      key: "",
      value: "",
      identifier: "",
      id: "",
      createdby: "",
      isactive: true
    })
    setModal(true)
  };
  const onClickDelete = item => {
    setRowData(item)
    setDeleteModal(true)
  };
  const handleInputPrGrpChange = useCallback(
    debounce(async inputValue => {
        try {
            const selectPurchaseGroupData = await getSelectData(
                "purchase_group_code",
                inputValue,
                "purchase_group"
            );
            setOptionPurchaseGroup(selectPurchaseGroupData?.getDataByColNameData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, 300),
    []
);

 

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_SITESETTING_REQUEST,
        payload: rowData.id,
      });
      setDeleteModal(false)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const validateForm = () => {
   
    const errors = {};
    if (!formData.key.trim()) {
      errors.key = "Name is required";
    }
    if (!formData.value.trim()) {
      errors.value = " Description is required";
    }
    if (!formData.identifier) {
      errors.identifier = "Type is required";
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
          formData,
          isActive,
          Id,
        };
        dispatch({
          type: UPDATE_SITESETTING_REQUEST,
          payload: Data,
        });
      } else {
        const Data = {
          formData,
          isActive,
        };
        dispatch({
          type: ADD_SITESETTING_REQUEST,
          payload: Data,
        });
      }
      setModal(false);
      setEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error saving/editing data:", error);
    }
  };

  const openModal = (data = null) => {
    setEdit(data)
    setRowData(data)
    setSelectedGatePassType({value:data.type,label:data.type})
   setFormData({
    key: data?.name || "",
    value: data?.desc || "",
    identifier: data?.type || "",
    isactive: data?.isactive || true,
    })
    setModal(true)
    if (data) {
      setIsActive(data.isactive)
    }
  }

  const resetForm = () => {
    setErrors({});
    setEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Description",
        accessor: "desc",
      },
      {
        Header: "Type",
        accessor: "type",
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
                        name: "key",
                        isactive: !cellProps.row.original.isactive,
                        id: cellProps.row.original?.id,
                      },
                    });
                  }}
                />
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
               {sitesettingPermission && sitesettingPermission?.can_edit ? (
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

             {sitesettingPermission && sitesettingPermission?.can_delete ? (

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
    [status,sitesettingPermission]
  );

  document.title = "Detergent | Site Setting";
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
          <Breadcrumbs titlePath="#" title="Site Setting" breadcrumbItem="Site Setting" />
          <TableContainer
            columns={columns}
            data={siteSetting && siteSetting.length > 0 ? siteSetting : []}
            isGlobalFilter={true}
            isAddOptions={true}
            customPageSize={10}
            className="custom-header-css"
            addButtonLabel={
              sitesettingPermission && sitesettingPermission?.can_add
                ? "Add Site Setting"
                : null
            }

            handleClicks={handleClicks}
          />
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
                    <Label htmlFor="formrow-state-Input">Name</Label>
                    <Input
                      type="text"
                      name="key"
                      className={`form-control ${
                        formErrors.key ? "is-invalid" : ""
                      }`}
                      id="formrow-state-Input"
                      placeholder="Please Enter Name"
                      value={formData?.key}
                      onChange={e => {
                        setFormData(prevData => ({
                          ...prevData,
                          key: e.target.value,
                        }));
                        setFormErrors(prevErrors => ({
                          ...prevErrors,
                          key: "", 
                        }));
                      }}
                    />
                    {formErrors.key && (
                      <div className="invalid-feedback">
                        {formErrors.key}
                      </div>
                    )}
                  </div>
                </Col>
                <Col md={12} className="mb-3">
                  <Label htmlFor="name">Description</Label>
                  <Input
                    type="textarea"
                    id="name"
                    name="value"
                    className={`form-control ${
                      formErrors.value ? "is-invalid" : ""
                    }`}
                    value={formData.value}
                    rows="3"
                    placeholder="Please Enter Description"
                    onChange={e => {
                      setFormData(prevData => ({
                        ...prevData,
                        value: e.target.value,
                      }));
                      setFormErrors(prevErrors => ({
                        ...prevErrors,
                        value: "", 
                      }));
                    }}
                  />
                  {formErrors.value && (
                    <div className="invalid-feedback">
                      {formErrors.value}
                    </div>
                  )}
                </Col>
                <Col md="12" className="mb-3">
                                                <div className="">
                                                    <Label htmlFor="formrow-state-Input">Type</Label>
                                                    <Select
                                                        styles={customStyles}
                                                        value={selectGatePassType}
                                                        options={[
                                                            { value: 'GateNo', label: 'GateNo' },
                                                            { value: 'Purpose', label: 'Purpose' },
                                                            { value: 'GatePassType', label: 'GatePassType' },
                                                            { value: 'GPStatus', label: 'GPStatus' },
                                                        ]}
                                                        onChange={async (selectGatePassType) => {
                                                            setFormData((prevData) => ({
                                                                ...prevData,
                                                                identifier: selectGatePassType?.value,
                                                            }));
                                                            setSelectedGatePassType(selectGatePassType);
                                                        }}
                                                        onInputChange={(inputValue, { action }) => {
                                                            handleInputPrGrpChange(inputValue);
                                                        }}
                                                    />
                                                    {formErrors.identifier && (
                                                        <div
                                                            style={{
                                                                color: '#f46a6a',
                                                                fontSize: '80%',
                                                            }}
                                                        >
                                                            {formErrors.identifier}
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
                  className="btn-custom-theme "
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

export default siteSetting;
