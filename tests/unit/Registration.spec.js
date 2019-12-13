import Vue from "vue";
import {
  mount,
  createLocalVue
} from "@vue/test-utils";
import Registration from "@/views/Registration.vue";
import Vuetify from "vuetify";
import VueSignaturePad from "vue-signature-pad";
import countryMapper from "@/models/json/country.json";

describe("Registration.vue", () => {
  let wrapper;

  // create an extended `Vue` constructor
  const localVue = createLocalVue();

  // install plugins as normal
  localVue.use(VueSignaturePad);
  Vue.use(Vuetify);
  const vuetifyMod = new Vuetify({});

  wrapper = mount(Registration, {
    localVue,
    vuetify: vuetifyMod
  });

  beforeEach(() => {
    const createElement = document.createElement.bind(document);
    document.createElement = tagName => {
      if (tagName === "canvas") {
        return {
          getContext: () => ({}),
          measureText: () => ({})
        };
      }
      return createElement(tagName);
    };

    wrapper.vm.countryMapper = countryMapper
  });

  it("Test empty value", () => {
    const button = wrapper.find("[data-testid='btn-first-submit']");
    button.trigger("click");
    expect(wrapper.vm.steps).toBe(1);
    expect(wrapper.vm.$refs.form.validate()).toBe(false);
  });

  it("Test name validation", () => {
    const inputName = wrapper.find("[data-testid='inputName']");
    inputName.element.value = "abc";
    inputName.trigger("input");
    expect(wrapper.vm.$refs.inputNameRef.validate()).toBe(true);
    inputName.element.value =
      "akwkawkwkawkwakawkawkwakwakwakwkakwakwakwakwakwakwakwakkwakwakwakwakwakawkw";
    inputName.trigger("input");
    expect(wrapper.vm.$refs.inputNameRef.validate()).toBe(false);
  });

  it("Test number validation", () => {
    // global.window = Object.create(window);
    const url = "regtw.abc.com"; //testing for taiwan
    // setURL(url)
    //test url is correct
    expect(window.document.location.hostname).toEqual(url);
    const input = wrapper.find("[data-testid='inputNumber']");
    //test phone length
    expect(wrapper.vm.phoneMaxLength).toBe(10);
    //test correct phone
    input.element.value = "0986453444";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNumberRef.validate()).toBe(true);

    input.element.value = "1000000092";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNumberRef.validate()).toBe(false);
  });
});