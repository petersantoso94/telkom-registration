import Handler from '@/utilities/api-handler.js';

export default {
	async login(data) {
		const config = {
			url: `/login`,
			method: 'post',
			data,
		};
		const result = await Handler.request(config, false);
		return result.data;
	},
	async getCustomers() {
		const config = {
			url: `/customers`,
			method: 'get',
		};
		const result = await Handler.request(config);
		return result.data;
	},
	async getAdmins() {
		const config = {
			url: `/admins`,
			method: 'get',
		};
		const result = await Handler.request(config);
		return result.data;
	},
	async updateCustomerStatus(data) {
		const config = {
			url: `/customer/${data.id}`,
			method: 'put',
			data,
		};
		const result = await Handler.request(config);
		return result.data;
	},
	async updateMapper(data) {
		const config = {
			url: `/mapper`,
			method: 'post',
			data,
		};
		const result = await Handler.request(config);
		return result.data;
	},
	async getIdPhone(data) {
		const config = {
			url: `/mapper/${data.localphone}`,
			method: 'get',
		};
		const result = await Handler.request(config);
		return result.data;
	},
}