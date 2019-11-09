import Handler from '@/utilities/api-handler.js';

export default {
    async getBooks() {
		const config = {
			url: `/books`,
			method: 'get',
		};
		const result = await Handler.request(config);
		return result.data;
	},

}