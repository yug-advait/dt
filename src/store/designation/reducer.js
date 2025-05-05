import {
    GET_DESIGNATIONS_SUCCESS, GET_DESIGNATIONS_FAIL, ADD_DESIGNATIONS_SUCCESS, UPDATE_DESIGNATIONS_SUCCESS,
    DELETE_DESIGNATIONS_SUCCESS,
  } from "./actionTypes";

const INIT_STATE = {
    designations : [],
    errors : {}
}

const designations = (state = INIT_STATE, action) => {
    switch(action.type){
        case GET_DESIGNATIONS_SUCCESS:
            return {
                ...state,
                listDesignation: true,
                addDesignation :  false,
                updateDesignation : false,
                deleteDesignation : false,
                designations : action.payload
            };
        
        case ADD_DESIGNATIONS_SUCCESS : 
            return {
                ...state,
                listDesignation: false,
                addDesignation : action.payload
            };
        
        case UPDATE_DESIGNATIONS_SUCCESS:
            return {
                ...state,
                listDesignation: false,
                updateDesignation : action.payload
            };
        
        case DELETE_DESIGNATIONS_SUCCESS : 
            return {
                ...state,
                listDesignation: false,
                deleteDesignation : action.payload
            };
        
        case GET_DESIGNATIONS_FAIL : 
            return {
                ...state,
                listDesignation: false,
                error : action.payload
            };
        
        default :
            return state;
    }
};

export default designations;