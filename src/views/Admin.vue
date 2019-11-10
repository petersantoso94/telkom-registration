<template>
  <v-app id="inspire">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="customers"
      :single-select="singleSelect"
      item-key="id"
      show-select
      class="elevation-1"
    >
      <template v-slot:top>
        <v-switch v-model="singleSelect" label="Single select" class="pa-3"></v-switch>
      </template>
    </v-data-table>
  </v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import adminApi from "@/api/admin";

@Component()
export default class Login extends Vue {
  singleSelect = false;
  selected = [];
  headers = [
    {
      text: "id",
      align: "left",
      value: "id"
    },
    { text: "Nama", value: "name" },
    { text: "Nomor Telpon", value: "phone" },
    { text: "NIK", value: "nik" },
    { text: "Nomor KK", value: "nokk" },
    { text: "Status", value: "status" }
  ];
  customers = [];

  mounted() {
    adminApi.getCustomers().then(resp => {
      this.customers = resp;
    });
  }
}
</script>