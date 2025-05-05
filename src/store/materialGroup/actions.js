import { GET_MATERIALGROUP, ADD_MATERIALGROUP_SUCCESS, GET_MATERIALGROUP_FAIL, GET_MATERIALGROUP_SUCCESS,
  UPDATE_MATERIALGROUP_SUCCESS,DELETE_MATERIALGROUP_SUCCESS
 } from "./actionTypes"
export const getMaterialGroup = () => ({
  type: GET_MATERIALGROUP,
})
                                                                
export const getMaterialGroupSuccess = materialGroup => 
  ({
  type: GET_MATERIALGROUP_SUCCESS,
  payload: materialGroup,
})

export const addMaterialGroup= materialGroupData => ({
  type: ADD_MATERIALGROUP_SUCCESS,
  payload: materialGroupData,
});

export const updateMaterialGroup = materialGroupData => ({
  type: UPDATE_MATERIALGROUP_SUCCESS,
  payload: materialGroupData,
});

export const deleteMaterialGroup = materialGroupData => ({
  type: DELETE_MATERIALGROUP_SUCCESS,
  payload: materialGroupData,
});

export const getMaterialGroupFail = error => ({
  type: GET_MATERIALGROUP_FAIL,
  payload: error,
})
