import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
  if (localStorage.getItem("authUser")) {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    return obj;
  }
};


export const getWorkingCalender = async () => {
  try {
    const userData = getUserData();
    const token = userData?.token
    const response = await axios.get(`${apiUrl}/working_calender/calender`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const workingCalender = response?.data?.calendersData || [];
    return workingCalender;
  } catch (error) {
    return [];
  }
};

export const addWorkingCalenderApiCall = async (
  formData,
  isActive,
  Id,
  isdeleted
) => {
  const userData = getUserData();
  const token = userData?.token
  const userID = userData?.user?.id
  try {
    let requestBody = {
      country_id:formData?.country_id,
      calender_id:formData?.calender_id,
      calender_description:formData?.calender_description,
      calender_indicator:formData?.calender_indicator,
      week_day_monday:formData?.week_day_monday,
      week_day_tuesday:formData?.week_day_tuesday,
      week_day_wednesday:formData?.week_day_wednesday,
      week_day_thursday:formData?.week_day_thursday,
      week_day_friday:formData?.week_day_friday,
      week_day_saturday:formData?.week_day_saturday,
      week_day_sunday:formData?.week_day_sunday,
      isactive: isActive,
      id: Id,
    };

    if (Id === 0) {
      requestBody = {
        ...requestBody,
        createdby: userID,
        isdeleted: isdeleted,
      };
    } else {
      requestBody = {
        ...requestBody,
        updatedby: userID,
        isdeleted: isdeleted,
      };
    }

    const response = await axios.post(
      `${apiUrl}/working_calender/calender/${Id}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.success;
  } catch (error) {
    return false;
  }
};
