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
								:hint="`tekan 'enter' untuk menyimpan`"
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
					<v-btn color="primary" v-if="item.pkk" @click="openPhoto(item.pkk)" fab small dark>
						<v-icon>pageview</v-icon>
					</v-btn>
				</template>

				<template v-slot:item.pktp="{ item }">
					<v-btn color="primary" v-if="item.pktp" @click="openPhoto(item.pktp)" fab small dark>
						<v-icon>pageview</v-icon>
					</v-btn>
				</template>
				<template v-slot:item.updated_at="{ item }">
					<v-btn color="primary" @click="showPDF(item.id)" fab small dark>
						<v-icon>picture_as_pdf</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card>
		<v-dialog v-model="dialog" max-width="500">
			<v-card>
				<v-card-title class="headline">Telin</v-card-title>
				<v-img
					:src="imgUrl"
					:contain="true"
					height="250"
					v-if="imgUrl"
					style="margin-left:5px;margin-right:5px;"
				/>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="dialog = false">Tutup</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="pdfDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
			<v-card>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click="pdfDialog = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-toolbar-title>Surat Kuasa dari: {{selectedCustomerPDF.name}}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-toolbar-items>
						<v-btn dark text @click="exportPDF">Export</v-btn>
					</v-toolbar-items>
				</v-toolbar>
				<v-list dense id="pdf-for-print" class="pdfa4paper">
					<div class="pdfWrapper">
						<v-list-item>
							<v-list-item-content class="text-left">Surat Pernyataan:</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content class="text-left">Saya yang bertandatangan dibawah ini,</v-list-item-content>
						</v-list-item>
						<v-spacer></v-spacer>
						<v-list-item>
							<v-list-item-content class="text-left">Nama: {{selectedCustomerPDF.name}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content class="text-left">NIK: {{selectedCustomerPDF.nik}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content class="text-left">No Kartu As: {{selectedCustomerPDF.phone}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content
								class="text-left"
							>Bersedia memberikan kuasa kepada Telin {{selectedCustomerPDF.country}} untuk melakukan registrasi nomor Kartu As Telkomsel</v-list-item-content>
						</v-list-item>
					</div>
				</v-list>
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
import html2canvas from "html2canvas";
import jsPdf from "jspdf";

@Component()
export default class Login extends Vue {
	snack = false;
	dialog = false;
	pdfDialog = false;
	imgUrl = "";
	selectStatus = ["approved", "rejected", "pending"];
	selectedCustomerPDF = {};
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
		{ text: "Waktu Register", value: "created_at" },
		{ text: "Status", value: "status" },
		{ text: "Actions", value: "updated_at" }
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

	showPDF(id) {
		this.selectedCustomerPDF = this.customers.filter(item => {
			return item.id === id;
		})[0];
		this.pdfDialog = true;
	}

	exportPDF() {
		const domElement = document.getElementById("pdf-for-print");
		html2canvas(domElement, {
			dpi: 300 // Set to 300 DPI
		})
			.then(canvas => {
				const img = canvas.toDataURL("image/png");
				const pdf = new jsPdf("p", "mm", "a4");
				pdf.addImage(img, "JPEG", 0, -14, 211, 320);
				pdf.save(
					this.selectedCustomerPDF.country +
						"-" +
						this.selectedCustomerPDF.phone +
						".pdf"
				);
			})
			.finally(() => {
				this.pdfDialog = false;
			});
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

<style>
.pdfa4paper {
	width: 22cm;
	height: 30cm;
	display: block;
	margin: 0 auto;
	box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
}
.pdfWrapper {
	background: white;
	width: 100%;
	height: 100%;
}
</style>
