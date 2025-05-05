import {
  GET_INVOICE_SUCCESS,
  GET_INVOICE_FAIL,
  ADD_INVOICE_SUCCESS,
  UPDATE_INVOICE_SUCCESS,
  DELETE_INVOICE_SUCCESS,
} from "./actionTypes";

const INIT_STATE = {
  invoice: [],
  error: {},
};
const invoice = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_INVOICE_SUCCESS:
      return {
        ...state,
        listInvoice: true,
        addInvoice: false,
        updateInvoice: false,
        deleteInvoice: false,
        invoices: action.payload,
      };
    case ADD_INVOICE_SUCCESS:
      return {
        ...state,
        listInvoice: false,
        addInvoice: action.payload,
      };
    case UPDATE_INVOICE_SUCCESS:
      return {
        ...state,
        listInvoice: false,
        updateInvoice: action.payload,
      };
    case DELETE_INVOICE_SUCCESS:
      return {
        ...state,
        listInvoice: false,
        deleteInvoice: action.payload,
      };

    case GET_INVOICE_FAIL:
      return {
        ...state,
        listInvoice: true,
        addInvoice: false,
        updateInvoice: false,
        deleteInvoice: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default invoice;
