import { takeEvery, call, put } from "redux-saga/effects";
import { getInquiryItemSuccess, getInquiryItemFail, addInquiryItem, updateInquiryItem, deleteInquiryItem } from "./actions";
import { ADD_INQUIRY_ITEM_REQUEST, GET_INQUIRY_ITEM_REQUEST, UPDATE_INQUIRY_ITEM_REQUEST, DELETE_INQUIRY_ITEM_REQUEST } from "./actionTypes";

// Include Both Helper File with needed methods
import { getInquiryItem, createUpdateDeleteInquiryItemApiCall } from "helpers/Api/api_inquiryItemCategory";

function* inquiryItemSaga() {
    try {
        const response = yield call(getInquiryItem);
        yield put(getInquiryItemSuccess(response))
    } catch (error) {
        yield put(getInquiryItemFail(error));
    }
}

function* addInquiryItemSaga(action) {
    const { formData } = action.payload
    try {
        const response = yield call(createUpdateDeleteInquiryItemApiCall, 0, formData, false)
        yield put(addInquiryItem(response));
    } catch (error) {
        yield put(getInquiryItemFail(error));
    }
}
function* updateInquiryItemSaga(action) {
    const { formData, isActive, Id } = action.payload
    try {
        const response = yield call(createUpdateDeleteInquiryItemApiCall, Id, formData, false)
        yield put(updateInquiryItem(response));
    } catch (error) {
        yield put(getInquiryItemFail(error));
    }
}
function* deleteInquiryItemSaga(action) {
    try {
        const response = yield call(createUpdateDeleteInquiryItemApiCall, action.payload, '', true)
        yield put(deleteInquiryItem(response))
    } catch (error) {
        yield put(getInquiryItemFail(error))
    }
}

function* inquiryItemAllSaga() {
    yield takeEvery(ADD_INQUIRY_ITEM_REQUEST, addInquiryItemSaga)
    yield takeEvery(UPDATE_INQUIRY_ITEM_REQUEST, updateInquiryItemSaga)
    yield takeEvery(DELETE_INQUIRY_ITEM_REQUEST, deleteInquiryItemSaga)
    yield takeEvery(GET_INQUIRY_ITEM_REQUEST, inquiryItemSaga)
}

export { inquiryItemAllSaga } 