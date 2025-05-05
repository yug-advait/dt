import {
    GET_LANGUAGES, GET_LANGUAGES_SUCCESS, GET_LANGUAGES_FAIL,
    ADD_LANGUAGE_SUCCESS, UPDATE_LANGUAGE_SUCCESS, DELETE_LANGUAGE_SUCCESS
} from "./actionTypes";

//GET Languages
export const getLanguages = () => ({
    type: GET_LANGUAGES
});

//GET Languages Success
export const getLanguagesSuccess = languages => ({
    type: GET_LANGUAGES_SUCCESS,
    payload: languages
});

//GET Languages Fail
export const getLanguagesFail = error => ({
    type: GET_LANGUAGES_FAIL,
    payload: error
});

// POST Add Languages 
export const addLanguage = languageData => ({
    type: ADD_LANGUAGE_SUCCESS,
    payload: languageData
});

// POST Update Languages
export const updateLanguage = languageData => ({
    type: UPDATE_LANGUAGE_SUCCESS,
    payload: languageData
});

//POST Delete Language
export const deleteLanguage = languageData => ({
    type: DELETE_LANGUAGE_SUCCESS,
    payload: languageData
});