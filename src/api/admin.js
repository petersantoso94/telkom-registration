import Handler from '@/utilities/api-handler.js';

export default {
	async login(data) {
		const config = {
			url: `/login`,
			method: 'post',
			data,
		};
		const result = await Handler.request(config);
		return result.data;
	},

}