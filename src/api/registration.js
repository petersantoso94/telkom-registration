import Handler from '@/utilities/api-handler.js';

export default {
    async register(data) {
        const config = {
            url: `/customer`,
            method: 'post',
            data,
        };
        const result = await Handler.request(config, false, "multipart/form-data");
        return result.data;
    }
}