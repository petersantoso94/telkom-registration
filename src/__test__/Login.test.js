import {
    mount
} from 'vue-test-utils'
import Login from '../views/Login.vue'

describe('Login.vue', () => {
    it('displays correct test', () => {
        const wrapper = mount(Login)

        expect(wrapper.contain('input[name==username]')).toBe(true)
    })
})