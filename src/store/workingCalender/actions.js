import { GET_WORKINGCALENDER, ADD_WORKINGCALENDER_SUCCESS, GET_WORKINGCALENDER_FAIL, GET_WORKINGCALENDER_SUCCESS,
  UPDATE_WORKINGCALENDER_SUCCESS,DELETE_WORKINGCALENDER_SUCCESS
 } from "./actionTypes"
export const getWorkingCalender = () => ({
  type: GET_WORKINGCALENDER,
})
                                                                
export const getWorkingCalenderSuccess = workingCalender => 
  ({
  type: GET_WORKINGCALENDER_SUCCESS,
  payload: workingCalender,
})

export const addWorkingCalender= workingCalenderData => ({
  type: ADD_WORKINGCALENDER_SUCCESS,
  payload: workingCalenderData,
});

export const updateWorkingCalender = workingCalenderData => ({
  type: UPDATE_WORKINGCALENDER_SUCCESS,
  payload: workingCalenderData,
});

export const deleteWorkingCalender = workingCalenderData => ({
  type: DELETE_WORKINGCALENDER_SUCCESS,
  payload: workingCalenderData,
});

export const getWorkingCalenderFail = error => ({
  type: GET_WORKINGCALENDER_FAIL,
  payload: error,
})
