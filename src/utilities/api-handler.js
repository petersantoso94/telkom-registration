import axios from 'axios';
import Cookies from 'js-cookie';
import {
	responseSuccess,
	responseFail
} from './error-handler';


class HttpModel {
	constructor() {}
	async request(cfg, authNeeded = true) {
		const instance = axios.create();
		const token = Cookies.get('token')
		cfg.baseURL = process.env.VUE_APP_API_URL
		if (authNeeded) {
			cfg.headers = {
				Authorization: `Bearer ${token}`,
				'content-type': 'application/json',
			};
		} else {
			cfg.headers = {
				'content-type': 'application/json',
			};
		}
		let result;
		instance.interceptors.response.use(response => responseSuccess(response), error => responseFail(error));
		try {
			result = await instance.request(cfg);
			return Promise.resolve(result);
		} catch (throwError) {
			return Promise.reject(throwError);
		}
	}
}

const model = new HttpModel();

export default model;