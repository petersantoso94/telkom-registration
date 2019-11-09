import axios from 'axios';

class HttpModel {
	constructor() {}
	async request(cfg) {
        cfg.baseURL = "http://localhost"
		const instance = axios.create();
		let result;
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
