import { takeEvery, call, put } from "redux-saga/effects";
import { getLanguagesSuccess, getLanguagesFail, updateLanguage, deleteLanguage, addLanguage } from "./actions";
import { ADD_LANGUAGE_REQUEST, DELETE_LANGUAGE_REQUEST, GET_LANGUAGES_REQUEST, UPDATE_LANGUAGE_REQUEST } from "./actionTypes";
import { addUpdateDeleteLanguageApiCall, getLanguagesApiCall } from "helpers/Api/api_language";

// Get Language Saga
function* getLanguageSaga() {
    try {
        const response = yield call(getLanguagesApiCall);
        yield put(getLanguagesSuccess(response));
    }
    catch (error) {
        yield put(getLanguagesFail(error));
    }
}

// Add Language Saga
function* addLanguageSaga(action) {
    const { languageShortCode, languageDescription, isActive } = action.payload;
    try {
        const response = yield call(addUpdateDeleteLanguageApiCall, 0, languageShortCode, languageDescription, isActive, false)
        yield put(addLanguage(response));
    }
    catch (error) {
        yield put(getLanguagesFail(error));
    }
}

// Update Language Saga
function* updateLanguageSaga(action) {
    const { Id, languageShortCode, languageDescription, isActive } = action.payload;
    try {
        const response = yield call(addUpdateDeleteLanguageApiCall, Id, languageShortCode, languageDescription, isActive, false)
        yield put(updateLanguage(response));
    }
    catch (error) {
        yield put(getLanguagesFail(error));
    }
}

// Delete Language Saga
function* deleteLanguageSaga(action) {

    try {
        const response = yield call(addUpdateDeleteLanguageApiCall, action.payload, '', '', '', true);
        yield put(deleteLanguage(response));
    }
    catch (error) {
        yield put(getLanguagesFail(error));
    }
}
// Language Saga
function* languageAllSaga() {
    yield takeEvery(GET_LANGUAGES_REQUEST, getLanguageSaga);
    yield takeEvery(ADD_LANGUAGE_REQUEST, addLanguageSaga);
    yield takeEvery(UPDATE_LANGUAGE_REQUEST, updateLanguageSaga);
    yield takeEvery(DELETE_LANGUAGE_REQUEST, deleteLanguageSaga);
}

export { languageAllSaga };