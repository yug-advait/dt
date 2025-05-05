import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Table, Alert, Button } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import {
  GET_DEPARTMENTPERMISSION_REQUEST,
  UPDATE_DEPARTMENTPERMISSION_REQUEST,
} from "../../../store/departmentpermission/actionTypes";
import { getDepartmentPermission } from "helpers/Api/api_admins";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../components/Common/Loader";
import "../../../assets/scss/custom/pages/__loader.scss"; 

const DepartmentPermission = () => {
  const dispatch = useDispatch();
  const {
    departmentpermission,
    listDepartmentPermission,
    updateDepartmentPermission,
  } = useSelector(state => state.departmentpermission);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [menuList, setMenuList] = useState([]);
  const [optionDepartment, setOptionDepartment] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  

  const handleCheckboxChange = (idx, checkboxLabel, value) => {
    const newValues = [...menuList];
    newValues[idx] = {
      ...newValues[idx],
      [checkboxLabel]: value,
    };
    setMenuList(newValues);
  };

  const handleNumberChange = (idx, checkboxLabel, value) => {
    const newValues = [...menuList];
    newValues[idx] = {
      ...newValues[idx],
      [checkboxLabel]: value,
    };
    setMenuList(newValues);
  };

  useEffect(() => {
    dispatch({
      type: GET_DEPARTMENTPERMISSION_REQUEST,
      payload: [],
    });
  }, []);

  useEffect(() => {
    if (listDepartmentPermission) {
      setLoading(false)
      setOptionDepartment(departmentpermission?.departments);
    }
    if (updateDepartmentPermission) {
      setToast(true);
      setToastMessage("Department updated successfully");
      setTimeout(() => {
        setToast(false);
        setFormData({ department_id: "" });
        setMenuList([]);
      }, 2000);
      dispatch({
        type: GET_DEPARTMENTPERMISSION_REQUEST,
        payload: [],
      });
    }
  }, [listDepartmentPermission, updateDepartmentPermission, toast]);

  const validateForm = () => {
    const errors = {};
    if (!formData.department_id) {
      errors.department_id = "Department is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    try {
      if (!validateForm()) {
        return;
      }
      const Data = {
        formData,
        menuList,
      };
      dispatch({
        type: UPDATE_DEPARTMENTPERMISSION_REQUEST,
        payload: Data,
      });
    } catch (error) {
      console.error("Error saving/editing data:", error);
    }
  };

  document.title = "Detergent | Department Permission";

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
          <Breadcrumbs
            titlePath="#"
            title="Master"
            breadcrumbItem="Department Permission"
          />
           {loading ? (
            <Loader />
          ) : (
          <div>
            <Row>
              <Col lg="6">
                <div className="form-floating mb-3">
                  <select
                    value={formData.department_id}
                    onChange={async event => {
                      const selectedOption = optionDepartment?.find(
                        option => option.value == event.target.value
                      );
                      setFormData(prevData => ({
                        ...prevData,
                        department_id: selectedOption?.value,
                      }));
                      const menuListData = await getDepartmentPermission(
                        selectedOption?.value
                      );
                      setMenuList(menuListData);
                    }}
                    className="form-select"
                  >
                    <option value="0">Select Department</option>
                    {optionDepartment?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="department_id">Department</label>
                  {formErrors.department_id && (
                    <div style={{ color: "#f46a6a", fontSize: "80%" }}>
                      {formErrors.department_id}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h4">Permissions</CardTitle>
                    <div className="table-responsive">
                      <Table className="table mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Can List</th>
                            <th>Can Add</th>
                            <th>Can Edit</th>
                            <th>Can Delete</th>
                            <th>Can Approved</th>
                          </tr>
                        </thead>
                        <tbody>
                          {menuList.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.sub_menu_label}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={menuList[idx]?.can_list}
                                  onChange={e =>
                                    handleCheckboxChange(
                                      idx,
                                      "can_list",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={menuList[idx]?.can_add}
                                  onChange={e =>
                                    handleCheckboxChange(
                                      idx,
                                      "can_add",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={menuList[idx]?.can_edit}
                                  onChange={e =>
                                    handleCheckboxChange(
                                      idx,
                                      "can_edit",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={menuList[idx]?.can_delete}
                                  onChange={e =>
                                    handleCheckboxChange(
                                      idx,
                                      "can_delete",
                                      e.target.checked
                                    )
                                  }
                                />
                              </td>
                              <td>
                                {item.sub_menu_name == "po" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="inline-elements"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={menuList[idx]?.can_approved}
                                      onChange={e => {
                                        handleCheckboxChange(
                                          idx,
                                          "can_approved",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <input
                                      style={{ marginLeft: "10px" }}
                                      type="number"
                                      value={
                                        menuList[idx]?.amount == null
                                          ? 0
                                          : menuList[idx]?.amount
                                      }
                                      onChange={e =>
                                        handleNumberChange(
                                          idx,
                                          "amount",
                                          parseInt(e.target.value, 10)
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {item.sub_menu_name == "pr" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="inline-elements"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={menuList[idx]?.can_approved}
                                      onChange={e => {
                                        handleCheckboxChange(
                                          idx,
                                          "can_approved",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <input
                                      style={{ marginLeft: "10px" }}
                                      type="number"
                                      value={
                                        menuList[idx]?.amount == null
                                          ? 0
                                          : menuList[idx]?.amount
                                      }
                                      onChange={e =>
                                        handleNumberChange(
                                          idx,
                                          "amount",
                                          parseInt(e.target.value, 10)
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {item.sub_menu_name == "asn" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="inline-elements"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={menuList[idx]?.can_approved}
                                      onChange={e => {
                                        handleCheckboxChange(
                                          idx,
                                          "can_approved",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <input
                                      style={{ marginLeft: "10px" }}
                                      type="number"
                                      value={
                                        menuList[idx]?.amount == null
                                          ? 0
                                          : menuList[idx]?.amount
                                      }
                                      onChange={e =>
                                        handleNumberChange(
                                          idx,
                                          "amount",
                                          parseInt(e.target.value, 10)
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {item.sub_menu_name == "rfq" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="inline-elements"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={menuList[idx]?.can_approved}
                                      onChange={e => {
                                        handleCheckboxChange(
                                          idx,
                                          "can_approved",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <input
                                      style={{ marginLeft: "10px" }}
                                      type="number"
                                      value={
                                        menuList[idx]?.amount == null
                                          ? 0
                                          : menuList[idx]?.amount
                                      }
                                      onChange={e =>
                                        handleNumberChange(
                                          idx,
                                          "amount",
                                          parseInt(e.target.value, 10)
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                                {item.sub_menu_name == "grn" ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                    className="inline-elements"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={menuList[idx]?.can_approved}
                                      onChange={e => {
                                        handleCheckboxChange(
                                          idx,
                                          "can_approved",
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <input
                                      style={{ marginLeft: "10px" }}
                                      type="number"
                                      value={
                                        menuList[idx]?.amount == null
                                          ? 0
                                          : menuList[idx]?.amount
                                      }
                                      onChange={e =>
                                        handleNumberChange(
                                          idx,
                                          "amount",
                                          parseInt(e.target.value, 10)
                                        )
                                      }
                                    />
                                  </div>
                                ) : (
                                  ""
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <div className="mt-4 d-flex justify-content-center">
              <Button onClick={handleSave} className="btn-custom-theme">
                Save
              </Button>
            </div>
          </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default DepartmentPermission;
