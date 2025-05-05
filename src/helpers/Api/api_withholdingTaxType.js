import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

const getUserData = () => {
    if (localStorage.getItem("authUser")) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        return obj;
    }
};


export const getWithholdingTaxTypes = async () => {
    try {
        const userData = getUserData();
        const token = userData?.token
        const response = await axios.get(`${apiUrl}/with_holding_tax_types/with_holding_tax_type`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const withHoldingTaxTypes = response?.data?.withHoldingTaxTypesData || [];
        return withHoldingTaxTypes;
    } catch (error) {
        return false;
    }
};

//Add, Update, Delete Withholding Tax Type
export const addUpdateDeleteWithholdingTaxTypes = async (Id, formData, selectCountry, isDeleted) => {
    const userData = getUserData();
    const token = userData?.token
    const userID = userData?.user?.id
    try {

        let requestBody = {
            country_id: selectCountry?.value,
            withholding_tax_type: formData?.withholding_tax_type,
            withholding_tax_code: formData?.withholding_tax_code,
            withholding_tax_percentage: formData?.withholding_tax_percentage,
            section_code: formData?.section_code,
            subsection_code: formData?.subsection_code,
            isactive: formData.isactive,
            id: Id,
        };

        if (Id === 0) {
            requestBody = {
                ...requestBody,
                createdby: userID,
                isdeleted: isDeleted,
            };
        } else {
            requestBody = {
                ...requestBody,
                updatedby: userID,
                isdeleted: isDeleted,
            };
        }

        const response = await axios.post(
            `${apiUrl}/with_holding_tax_types/with_holding_tax_type/${Id}`,
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
