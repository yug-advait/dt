import { GET_LANGUAGES_SUCCESS, GET_LANGUAGES_FAIL, ADD_LANGUAGE_SUCCESS, UPDATE_LANGUAGE_SUCCESS, DELETE_LANGUAGE_SUCCESS } from "./actionTypes";
import { error } from "toastr";

// Defining initial State
const INIT_STATE = {
    languages: [],
    error: {}
};

//
const languages = (state = INIT_STATE, action) => {
    switch (action.type) {
        // Get Language Success
        case GET_LANGUAGES_SUCCESS:
            return {
                ...state,
                listLanguage: true,
                addLanguage: false,
                updateLanguage: false,
                deleteLanguage: false,
                languages: action.payload
            }

        //Add Language
        case ADD_LANGUAGE_SUCCESS:
            return {
                ...state,
                listLanguage: false,
                addLanguage: action.payload
            }

        // Update Language
        case UPDATE_LANGUAGE_SUCCESS:
            return {
                ...state,
                listLanguage: false,
                updateLanguage: action.payload
            }

        // Delete Language
        case DELETE_LANGUAGE_SUCCESS:
            return {
                ...state,
                listLanguage: false,
                deleteLanguage: action.payload
            }

        // Get Language Fail
        case GET_LANGUAGES_FAIL:
            return {
                ...state,
                listLanguage: false,
                error: action.payload
            };

        //Default 
        default:
            return state;
    }
};

export default languages;
