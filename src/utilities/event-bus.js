import Vue from 'vue';

export const SystemAlert = (type, message, callback = () => {}) => {
    EventBus.$emit('system-alert', {
        type,
        message,
        callback,
    });
};

export const ShowLoader = () => {
    EventBus.$emit('show-loader');
};

const EventBus = new Vue();
export default EventBus;