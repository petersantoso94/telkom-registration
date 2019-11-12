<template>
	<v-app id="inspire">
		<v-card>
			<v-card-title>
				Customers
				<v-spacer></v-spacer>
				<v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
			</v-card-title>
			<v-data-table
				v-model="selected"
				:headers="headers"
				:items="customers"
				:search="search"
				item-key="id"
				class="elevation-1"
			>
				<template v-slot:item.status="{ item }">
					<v-edit-dialog @save="save(item)" @cancel="cancel" @open="open" @close="close">
						<v-chip :color="getColor(item.status)" dark>{{ item.status }}</v-chip>
						<template v-slot:input>
							<v-select
								v-model="item.status"
								:hint="`<pending, approved, rejected>`"
								:items="selectStatus"
								item-text="text"
								item-value="value"
								label="status"
								persistent-hint
								return-value
								single-line
							></v-select>
						</template>
					</v-edit-dialog>
				</template>

				<template v-slot:item.pkk="{ item }">
					<v-btn color="primary" @click="openPhoto(item.pkk)" fab small dark>
						<v-icon>pageview</v-icon>
					</v-btn>
				</template>

				<template v-slot:item.pktp="{ item }">
					<v-btn color="primary" @click="openPhoto(item.pktp)" fab small dark>
						<v-icon>pageview</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card>
		<v-dialog v-model="dialog" max-width="500">
			<v-card>
				<v-card-title class="headline">Telin</v-card-title>

				<v-img :src="imgUrl" height="250" v-if="imgUrl" style="margin-left:5px;margin-right:5px;" />

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="dialog = false">Tutup</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-snackbar v-model="snack" :timeout="2000" :color="snackColor">
			{{ snackText }}
			<v-btn text @click="snack = false">Close</v-btn>
		</v-snackbar>
	</v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Cookies from "js-cookie";
import adminApi from "@/api/admin";

@Component()
export default class Login extends Vue {
	snack = false;
	dialog = false;
	imgUrl = "";
	selectStatus = ["approved", "rejected", "pending"];
	snackColor = "";
	snackText = "";
	singleSelect = false;
	search = "";
	selected = [];
	adminDetail = {};
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
		{ text: "Foto KK", value: "pkk" },
		{ text: "Foto KTP", value: "pktp" },
		{ text: "Status", value: "status" }
	];
	customers = [];

	openPhoto(imageName) {
		this.dialog = true;
		this.imgUrl =
			window.location.protocol +
			"//" +
			window.location.hostname +
			":3000/uploads/" +
			imageName;
	}

	closePhoto() {
		this.dialog = false;
		this.imgUrl = "";
	}

	getColor(status) {
		switch (status) {
			case "pending":
				return "orange";
			case "rejected":
				return "red";
			case "approved":
				return "green";
			default:
				break;
		}
	}

	save(param) {
		let { status, id } = param;
		let updateCustomerRequest = {
			status: status,
			id: id,
			admin_id: this.adminDetail.id
		};

		adminApi.updateCustomerStatus(updateCustomerRequest).then(resp => {
			if (resp.success) {
				this.snack = true;
				this.snackColor = "success";
				this.snackText = "Data saved";
			}
		});
	}
	cancel() {
		this.snack = true;
		this.snackColor = "error";
		this.snackText = "Canceled";
	}
	open() {
		this.snack = true;
		this.snackColor = "info";
		this.snackText = "Dialog opened";
	}
	close() {}

	mounted() {
		this.adminDetail = {
			username: Cookies.get("admin_username") || "admin",
			id: Cookies.get("admin_id") || "1"
		};
		adminApi.getCustomers().then(resp => {
			this.customers = resp;
		});
	}
}
</script>
