import { GET_MATERIALTYPE, ADD_MATERIALTYPE_SUCCESS, GET_MATERIALTYPE_FAIL, GET_MATERIALTYPE_SUCCESS,
  UPDATE_MATERIALTYPE_SUCCESS,DELETE_MATERIALTYPE_SUCCESS
 } from "./actionTypes"
export const getMaterialType = () => ({
  type: GET_MATERIALTYPE,
})
                                                                
export const getMaterialTypeSuccess = materialType => 
  ({
  type: GET_MATERIALTYPE_SUCCESS,
  payload: materialType,
})

export const addMaterialType= materialTypeData => ({
  type: ADD_MATERIALTYPE_SUCCESS,
  payload: materialTypeData,
});

export const updateMaterialType = materialTypeData => ({
  type: UPDATE_MATERIALTYPE_SUCCESS,
  payload: materialTypeData,
});

export const deleteMaterialType = materialTypeData => ({
  type: DELETE_MATERIALTYPE_SUCCESS,
  payload: materialTypeData,
});

export const getMaterialTypeFail = error => ({
  type: GET_MATERIALTYPE_FAIL,
  payload: error,
})
