const responseSuccess = (response) => {
    return Promise.resolve(response);
};

const responseFail = (errorData) => {
    if (!errorData.response.data) {
        alert("internal server error")
        return Promise.reject(errorData);
    }
    alert(errorData.response.data.message)
    return Promise.reject(errorData);
};




export {
    responseSuccess,
    responseFail
};