import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  Form,
  Label,
  Input,
  UncontrolledTooltip,
  Alert,
} from "reactstrap";

import Breadcrumbs from "../../../components/Common/Breadcrumb";
import TableContainer from "components/Common/TableContainer";
import { useSelector, useDispatch } from "react-redux";
import {
  GET_LANGUAGES_REQUEST,
  ADD_LANGUAGE_REQUEST,
  UPDATE_LANGUAGE_REQUEST,
  DELETE_LANGUAGE_REQUEST,
} from "store/language/actionTypes";
import { STATUS_REQUEST } from "store/common/actionTypes";
import DeleteModal from "components/Common/DeleteModal";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss";

const Language = () => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [languageShortCode, setLanguageShortCode] = useState("");
  const [languageDescription, setLanguageDescription] = useState("");
  const [languageRow, setLanguageRow] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [toastMessage, setToastMessage] = useState();
  const [selectedLanguageForEdit, setSelectedLanguageForEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [languagePermission, setLanguagePermission] = useState();
  const { languages, addLanguage, updateLanguage, listLanguage, deleteLanguage, error } =
    useSelector((state) => state.languages);
  const { updateCommon } = useSelector((state) => state.commons);

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
        permission.sub_menu_name === "languages"
    );
    setLanguagePermission(
      permissions.find(permission => permission.sub_menu_name === "languages")
    );
    dispatch({
      type: GET_LANGUAGES_REQUEST,
      payload: [],
    });
  }, [dispatch]);

  useEffect(() => {
    if (listLanguage) {
      setLoading(false)
    }
    if (addLanguage) {
      setToastMessage("Language Added Successfully.");
      dispatch({
        type: GET_LANGUAGES_REQUEST,
      });
      setToast(true);
    }
    if (updateLanguage) {
      setToastMessage("Language Updated Successfully.");
      dispatch({
        type: GET_LANGUAGES_REQUEST,
      });
      setToast(true);
    }
    if (deleteLanguage) {
      setToastMessage("Language Deleted Successfully.");
      dispatch({
        type: GET_LANGUAGES_REQUEST,
      });
      setToast(true);
    }
    if (updateCommon) {
      setToastMessage("Language Status Updated Successfully.");
      dispatch({
        type: STATUS_REQUEST,
      });
      dispatch({
        type: GET_LANGUAGES_REQUEST,
      });
      setToast(true);
    }
    setTimeout(() => {
      setToast(false);
    }, 3000);
  }, [addLanguage, updateLanguage, deleteLanguage, listLanguage, updateCommon, dispatch]);

  const handleSaveOrEdit = async (e) => {
    e.preventDefault();
    if (!languageShortCode.trim() || !languageDescription.trim()) {
      setErrors({
        languageShortCode: !languageShortCode.trim()
          ? "Language Short Code is required"
          : "",
        languageDescription: !languageDescription.trim()
          ? "Language Description is required"
          : "",
      });
      return;
    }

    if (languageShortCode.trim().length > 2|| languageDescription.trim().length > 40) {
      setErrors({
        languageShortCode: "Language Short Code must be exactly 2 characters.",
      });
      setErrors({
        languageDescription: "Language Description must be exactly 40 characters.",
      });
      return;
    }

    try {
      if (selectedLanguageForEdit) {
        const Id = selectedLanguageForEdit.id;
        const languageData = {
          Id,
          languageShortCode,
          languageDescription,
          isActive,
        };
        dispatch({
          type: UPDATE_LANGUAGE_REQUEST,
          payload: languageData,
        });
      } else {
        setToast(false);
        const languageData = {
          languageShortCode,
          languageDescription,
          isActive,
        };
        dispatch({
          type: ADD_LANGUAGE_REQUEST,
          payload: languageData,
        });
      }
      setModal(false);
      setSelectedLanguageForEdit(null);
      resetForm();
    } catch (error) {
      console.error("Error in saving/edting data : ", error);
    }
  };

  const handleDelete = async () => {
    try {
      dispatch({
        type: DELETE_LANGUAGE_REQUEST,
        payload: languageRow.id,
      });
      setDeleteModal(false);
    } catch (error) {
      console.error("Error in deleting data : ", error);
    }
  };

  const onClickDelete = (item) => {
    setLanguageRow(item);
    setDeleteModal(true);
  };

  const handleClicks = () => {
    setModal(true);
  };

  const openModal = (data = null) => {
    resetForm();
    setLanguageShortCode("");
    setLanguageDescription("");

    setSelectedLanguageForEdit(data);
    setModal(true);
    if (data) {
      setLanguageShortCode(data.language_short_code);
      setLanguageDescription(data.language_description);
      setIsActive(data.isactive);
    }
  };

  const resetForm = () => {
    setLanguageShortCode("");
    setLanguageDescription("");
    setErrors({});
    setSelectedLanguageForEdit(null);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Short Code",
        accessor: "language_short_code",
      },
      {
        Header: "Description",
        accessor: "language_description",
      },
      {
        Header: "Created On",
        accessor: "createdon",
        Cell: ({ value }) => {
          const formattedDate = moment(value).format("DD/MM/YYYY");
          return <div>{formattedDate}</div>;
        },
      },
      {
        Header: "Status",
        accessor: "isactive",
        Cell: (cellProps) => {
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
                        name: "language_master",
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
        Headers: "Actions",
        accessor: "action",
        disableFilters: true,
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              {languagePermission && languagePermission?.can_edit ? (
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
              {languagePermission && languagePermission?.can_delete ? (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => {
                    const DATA = cellProps.row.original;
                    onClickDelete(DATA);
                  }}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip
                    placement="top"
                    target="deletetooltip"
                  >
                    Delete
                  </UncontrolledTooltip>
                </Link>
              ) : null}
            </div>
          );
        },
      },
    ],
    [languagePermission]
  );

  document.title = " Detergent | Language";
  return (
    <React.Fragment>
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

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            titlePath="#"
            title="Master"
            breadcrumbItem="Language"
            breadcrumbItem2="languages"
            showBackButton={false}
          />

          <Row></Row>
          {loading ? (
            <Loader />
          ) : (
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={
                        languages && languages.length > 0 ? languages : []
                      }
                      isGlobalFilter={true}
                      isAddOptions={true}
                      customPageSize={10}
                      className="custom-header-css"
                      addButtonLabel={
                        languagePermission && languagePermission?.can_add
                          ? "Add Language"
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

        <Modal isOpen={modal} centered>
          <div className="modal-header">
            {selectedLanguageForEdit ? "Edit" : "Add"}

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
                    <Label htmlFor="formrow-state-Input">Short Code</Label>
                    <Input
                      type="text"
                      className={`form-control ${errors.languageShortCode ? "is-invalid" : ""
                        }`}
                      id="formrow-state-Input"
                      placeholder="Enter Language Short Code"
                      value={languageShortCode}
                      onChange={e => {
                        if (e.target.value.length <= 2) {
                          setLanguageShortCode(e.target.value);
                          setErrors({ ...errors, languageShortCode: "" });
                        } else {
                          setErrors({ ...errors, languageShortCode: "Language Short Code should contain 2 characters" });
                        }
                      }}
                    />
                    {errors.languageShortCode && (
                      <div className="invalid-feedback">
                        {errors.languageShortCode}
                      </div>
                    )}
                  </div>
                </Col>

                <Col md={12} className="mb-3">
                  <Label htmlFor="formmessage">Description</Label>
                  <Input
                    type="textarea"
                    id="formmessage"
                    className={`form-control ${errors.languageDescription ? "is-invalid" : ""
                      }`}
                    value={languageDescription}
                    rows="3"
                    placeholder="Enter Language Description"
                    onChange={(e) => {
                      setLanguageDescription(e.target.value);
                      setErrors({ ...errors, languageDescription: "" });
                    }}
                  />
                  {errors.languageDescription && (
                    <div className="invalid-feedback">
                      {errors.languageDescription}
                    </div>
                  )}
                </Col>

                <Col>
                  <div className="form-check form-switch mb-3" dir="ltr">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="customSwitchsizesm"
                      checked={isActive}
                      onClick={() => {
                        setIsActive(!isActive);
                      }}
                    />

                    <Label
                      className="form-check-label"
                      htmlFor="customSwitchsizesm"
                    >
                      Status
                    </Label>
                  </div>
                </Col>
              </Row>

              <div className="mt-3">
                <Button
                  //color="primary"
                  type="Submit"
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

export default Language;
