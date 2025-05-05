import { UPDATE_STATUS_SUCCESS} from "./actionTypes"

export const updateStatus = statusData => ({
  type: UPDATE_STATUS_SUCCESS,
  payload: statusData,
});
