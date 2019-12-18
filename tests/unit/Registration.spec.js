import Vue from "vue";
import {
  mount,
  createLocalVue,
} from "@vue/test-utils";
import Registration from "@/views/Registration.vue";
import Vuetify from "vuetify";
import VueSignaturePad from "vue-signature-pad";
import countryMapper from "@/models/json/country.json";
import kk from "@/assets/kk.jpg";

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

  const fs = require('fs');
  const path = require('path');

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
    const url = "regtw.abc.com"; //testing for taiwan, change this value as well in jest.config.js
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

    //test wrong phone
    input.element.value = "1000000092";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNumberRef.validate()).toBe(false);
    input.element.value = "";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNumberRef.validate()).toBe(false);
  });

  it("Test NIK validation", () => {
    // global.window = Object.create(window);
    const url = "regtw.abc.com"; //testing for taiwan, change this value as well in jest.config.js
    // setURL(url)
    //test url is correct
    expect(window.document.location.hostname).toEqual(url);
    const input = wrapper.find("[data-testid='inputNIK']");

    //test correct nik
    input.element.value = "1234567890123456";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNIKRef.validate()).toBe(true);

    //test wrong nik
    input.element.value = "1000000092";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNIKRef.validate()).toBe(false);
    input.element.value = "";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNIKRef.validate()).toBe(false);
  });

  it("Test NOKK validation", () => {
    // global.window = Object.create(window);
    const url = "regtw.abc.com"; //testing for taiwan, change this value as well in jest.config.js
    // setURL(url)
    //test url is correct
    expect(window.document.location.hostname).toEqual(url);
    const input = wrapper.find("[data-testid='inputNOKK']");

    //test correct nokk
    input.element.value = "1234567890123456";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNOKKRef.validate()).toBe(true);

    //test wrong nokk
    input.element.value = "1000000092";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNOKKRef.validate()).toBe(false);
    input.element.value = "";
    input.trigger("input");
    expect(wrapper.vm.$refs.inputNOKKRef.validate()).toBe(false);
  });

  it("Test PKK validation", () => {
    // global.window = Object.create(window);
    const url = "regtw.abc.com"; //testing for taiwan, change this value as well in jest.config.js
    // setURL(url)
    //test url is correct
    expect(window.document.location.hostname).toEqual(url);
    const input = wrapper.find("[data-testid='inputPKK']");
    // // test empty
    input.element.value = null
    input.trigger('change')
    expect(wrapper.vm.$refs.pkkInput.validate()).toBe(false);

    input.element.value = ""
    input.trigger('change')
    expect(wrapper.vm.$refs.pkkInput.validate()).toBe(true);

    // test with dummy txt file
    // const file = new File([''], 'test-image.png', {
    //   lastModified: 1449505890000,
    //   lastModifiedDate: new Date(1449505890000),
    //   name: "ecp-logo.png",
    //   size: 44320,
    //   type: "image/png",
    // });
    // console.log(kk)
    // input.element.files = kk
    // input.trigger('change')
    // expect(wrapper.vm.$refs.pkkInput.validate()).toBe(false);

    // // test with dummy png file
    // dT = new ClipboardEvent('').clipboardData || new DataTransfer()
    // dT.items.add(new File(['foo'], 'programmatically_created.png'))
    // input.element.files = dT.files
    // input.trigger('change')
    // expect(wrapper.vm.$refs.pkkInput.validate()).toBe(false);
  });
});