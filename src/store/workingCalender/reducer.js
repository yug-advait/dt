import {
  GET_WORKINGCALENDER_SUCCESS,
  GET_WORKINGCALENDER_FAIL,
  ADD_WORKINGCALENDER_SUCCESS,
  UPDATE_WORKINGCALENDER_SUCCESS,
  DELETE_WORKINGCALENDER_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  workingcalender: [],
  error: {},
};
const workingCalender = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_WORKINGCALENDER_SUCCESS:
      return {
        ...state,
        listWorkingCalender: true,
        addworkingCalender: false,
        updateworkingCalender: false,
        deleteworkingCalender: false,
        workingcalender: action.payload,
      };
    case ADD_WORKINGCALENDER_SUCCESS:
      return {
        ...state,
        listWorkingCalender: false,
        addworkingCalender: action.payload,
      };
    case UPDATE_WORKINGCALENDER_SUCCESS:
      return {
        ...state,
        listWorkingCalender: false,
        updateworkingCalender: action.payload,
      };
    case DELETE_WORKINGCALENDER_SUCCESS:
      return {
        ...state,
        listWorkingCalender: false,
        deleteworkingCalender: action.payload,
      };

    case GET_WORKINGCALENDER_FAIL:
      return {
        ...state,
        listWorkingCalender: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default workingCalender;
