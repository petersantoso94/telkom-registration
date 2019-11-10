import {
    SystemAlert
} from '@/utilities/event-bus';
import {
    MsgPopupType
} from '@/models/status/message'
import Cookies from "js-cookie";

const responseSuccess = (response) => {
    return Promise.resolve(response);
};

const responseFail = (errorData) => {
    if (!errorData.response.data) {
        SystemAlert(MsgPopupType.Error, "Internal Server Error!")
        return Promise.reject(errorData);
    }
    if (errorData.response.status === 401 || !Cookies.get('token')) {
        SystemAlert(MsgPopupType.Error, "Token expired, please re-login!");
        const host = window.location.hostname;
        Cookies.remove('token', {
            path: '/',
            domain: `${host}`
        });
        Cookies.remove('token');
        window.location.href = `/login`;
    }

    SystemAlert(MsgPopupType.Error, errorData.response.data.message);
    return Promise.reject(errorData);
};




export {
    responseSuccess,
    responseFail
};