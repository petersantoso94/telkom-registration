import {
    SystemAlert
} from '@/utilities/event-bus';
import {
    MsgPopupType
} from '@/models/status/message'

const responseSuccess = (response) => {
    return Promise.resolve(response);
};

const responseFail = (errorData) => {
    if (!errorData.response.data) {
        SystemAlert(MsgPopupType.Error, "Internal Server Error!")
        return Promise.reject(errorData);
    }
    SystemAlert(MsgPopupType.Error, errorData.response.data.message);
    return Promise.reject(errorData);
};




export {
    responseSuccess,
    responseFail
};