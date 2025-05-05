import {
  GET_COMPANYLEGALENTITY_SUCCESS,
  GET_COMPANYLEGALENTITY_FAIL,
  ADD_COMPANYLEGALENTITY_SUCCESS,
  UPDATE_COMPANYLEGALENTITY_SUCCESS,
  DELETE_COMPANYLEGALENTITY_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  companyLegalEntity: [],
  error: {},
};
const companyLegalEntity = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_COMPANYLEGALENTITY_SUCCESS:
      return {
        ...state,
        listCompanyLegalEntity: true,
        addCompanyLegalEntity: false,
        updateCompanyLegalEntity: false,
        deleteCompanyLegalEntity: false,
        companyLegalEntity: action.payload,
      };
    case ADD_COMPANYLEGALENTITY_SUCCESS:
      return {
        ...state,
        listCompanyLegalEntity: false,
        addCompanyLegalEntity: action.payload,
      };
    case UPDATE_COMPANYLEGALENTITY_SUCCESS:
      return {
        ...state,
        listCompanyLegalEntity: false,
        updateCompanyLegalEntity: action.payload,
      };
    case DELETE_COMPANYLEGALENTITY_SUCCESS:
      return {
        ...state,
        listCompanyLegalEntity: false,
        deleteCompanyLegalEntity: action.payload,
      };

    case GET_COMPANYLEGALENTITY_FAIL:
      return {
        ...state,
        listCompanyLegalEntity: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default companyLegalEntity;
