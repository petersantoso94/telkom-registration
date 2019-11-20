<template>
	<v-app id="inspire">
		<v-card>
			<v-card-title>
				Customers
				<v-spacer></v-spacer>
				<v-spacer></v-spacer>
				<v-btn class="ma-2" tile outlined color="success" @click="exportExcel">
					<v-icon left>mdi-export</v-icon>Export
				</v-btn>
				<v-btn class="ma-2" tile outlined color="success" @click="showUploadExcel = true">
					<v-icon left>mdi-import</v-icon>Import Mapping
				</v-btn>
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
		<v-dialog v-model="dialog" max-width="1000">
			<v-card>
				<v-card-title class="headline">Telin</v-card-title>
				<v-img
					:src="imgUrl"
					:contain="true"
					height="750"
					v-if="imgUrl"
					style="margin-left:5px;margin-right:5px;"
				/>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="green darken-1" text @click="dialog = false">Tutup</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="showUploadExcel" max-width="500">
			<v-card style="padding:0px 10px;">
				<v-card-title class="headline">Unggah Mapper</v-card-title>
				<v-card-title class="headline">(kolom1: no.lokal, kolom2: no.indo)</v-card-title>
				<v-file-input
					show-size
					v-model="excelFile"
					ref="excelInput"
					@change="uploadExcelFile"
					accept="application/x-iwork-keynote-sffnumbers, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
					prepend-icon="mdi-file"
					label="Unggah Excel File"
				></v-file-input>
				<v-card-actions>
					<v-btn color="green darken-1" text @click="showUploadExcel = false">Tutup</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog v-model="pdfDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
			<v-card>
				<v-toolbar dark color="primary">
					<v-btn icon dark @click="()=>{
						selectedCustomerPDF ={}
						pdfDialog = false}">
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
						<v-card
							class="d-flex flex-row justify-end"
							style="box-shadow: 0px 0px 0px #FFFFFF !important;"
							:flat="true"
						>
							<v-img
								class="align-end"
								:src="telinImg[selectedCustomerPDF.country]"
								height="100"
								max-width="100"
								:contain="true"
								v-if="telinImg[selectedCustomerPDF.country]"
								style="margin-left:5px;margin-right:5px;box-shadow: 0px 0px 0px #FFFFFF !important;"
							/>
						</v-card>
						<p
							class="title text-center font-weight-bold"
							style="text-decoration: underline;"
						>SURAT PERNYATAAN</p>
						<v-list-item>
							<v-list-item-content
								class="text-left text-justify"
							>Saya, yang bertanda tangan di bawah ini, menyatakan dengan hormat mengajukan permohonan bantuan kepada Bagian Pelayanan Pelanggan Telkomsel (“GraPARI”) untuk melakukan registrasi nomor As2in1 atas nama saya di bawah ini:</v-list-item-content>
						</v-list-item>
						<v-spacer></v-spacer>
						<v-container style="margin:5px">
							<v-row no-gutters>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>Nama</v-card>
								</v-col>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left text-capitalize"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{selectedCustomerPDF.name}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>Nomor As2in1</v-card>
								</v-col>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{selectedCustomerPDF.idphone}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>Nomor KTP</v-card>
								</v-col>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{selectedCustomerPDF.nik}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>Nomor Kartu Keluarga</v-card>
								</v-col>
								<v-col cols="12" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{selectedCustomerPDF.nokk}}</v-card>
								</v-col>
							</v-row>
						</v-container>

						<v-list-item>
							<p class="text-left">Bersama dengan surat ini, saya menyatakan sebagai berikut:</p>
						</v-list-item>
						<ul>
							<li>
								<v-list-item>
									<p
										class="text-left text-justify"
									>Untuk keperluan registrasi pelanggan jasa telekomunikasi sebagaimana diatur dalam ketentuan peraturan perundangan-undangan, data-data yang disampaikan di atas adalah benar. Apabila saya memberikan data yang tidak sesuai dan bertentangan dengan peraturan perundang-undangan, maka saya bersedia menerima segala konsekuensi yang berlaku.</p>
								</v-list-item>
							</li>
							<li>
								<v-list-item>
									<p
										class="text-left text-justify"
									>Saya secara berkala akan melakukan registrasi ulang untuk memastikan bahwa data-data yang saya sampaikan tervalidasi.</p>
								</v-list-item>
							</li>
						</ul>
						<v-list-item class="d-flex flex-row justify-end">
							<p
								class="text-end"
							>{{selectedCustomerPDF.country+", "+(selectedCustomerPDF.created_at?selectedCustomerPDF.created_at.split("T")[0]:"")}}</p>
						</v-list-item>
						<v-list-item class="d-flex flex-row justify-end">
							<p class="text-end">Pelanggan</p>
						</v-list-item>
						<v-list-item class="d-flex flex-row justify-end">
							<v-img
								crossorigin="anonymous"
								:src="selectedCustomerPDF.psignUrl"
								height="100"
								max-width="100"
								:contain="true"
								style="margin-left:5px;margin-right:5px;box-shadow: 0px 0px 0px #FFFFFF !important;"
							/>
						</v-list-item>
						<v-list-item class="d-flex flex-row justify-end">
							<p class="text-end text-capitalize">( {{selectedCustomerPDF.name}} )</p>
						</v-list-item>
					</div>
				</v-list>
			</v-card>
		</v-dialog>
		<v-snackbar v-model="snack" :timeout="2000" :color="snackColor">
			{{ snackText }}
			<v-btn text @click="snack = false">Tutup</v-btn>
		</v-snackbar>
		<v-overlay :value="showLoader" style="z-index: 9999">
			<v-progress-circular indeterminate size="70"></v-progress-circular>
		</v-overlay>
	</v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Cookies from "js-cookie";
import adminApi from "@/api/admin";
import html2canvas from "html2canvas";
import { SystemAlert } from "@/utilities/event-bus";
import { MsgPopupType } from "@/models/status/message";
import jsPdf from "jspdf";
import { json2excel } from "js2excel";
import XLSX from "xlsx";
import telinHk from "@/assets/telin-Hongkong.jpg";
import telinMalay from "@/assets/telin-Malaysia.jpg";
import telinTw from "@/assets/telin-Taiwan.jpg";
import localMapper from "@/models/json/country.json";

@Component()
export default class Login extends Vue {
	snack = false;
	dialog = false;
	pdfDialog = false;
	showUploadExcel = false;
	showLoader = false;
	baseUrl = "";

	imgUrl = "";
	telinImg = {
		Taiwan: telinTw,
		Malaysia: telinMalay,
		Hongkong: telinHk
	};
	selectStatus = ["approved", "rejected", "pending"];
	selectedCustomerPDF = {};
	snackColor = "";
	snackText = "";
	localnumber = [];
	idnumber = [];
	arr_admin = [];
	singleSelect = false;
	search = "";
	selected = [];
	excelFile = [];
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

	uploadExcelFile(files) {
		this.showLoader = true;
		if (!files) {
			this.showLoader = false;
			return;
		}
		const fr = new FileReader();
		fr.onload = e => {
			// pre-process data
			let binary = "";
			let bytes = new Uint8Array(e.target.result);
			let length = bytes.byteLength;
			for (let i = 0; i < length; i++) {
				binary += String.fromCharCode(bytes[i]);
			}

			/* read workbook */
			let wb = XLSX.read(binary, { type: "binary" });

			/* grab first sheet */
			let wsname = wb.SheetNames[0];
			let ws = wb.Sheets[wsname];
			let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
			//remove the first row: header
			data.shift();
			data.forEach(element => {
				if (!element[0] || !element[1]) {
					this.snack = true;
					this.snackColor = "error";
					this.snackText =
						"File excel yang diinput ada nomor kosong, harap di cek kembali!";
					return;
				}
				this.localnumber.push(element[0]);
				this.idnumber.push(element[1]);
				this.arr_admin.push(Cookies.get("admin_id") || "1");
			});
			const updateRequest = {
				localphone: this.localnumber,
				idphone: this.idnumber,
				admin_id: this.arr_admin
			};
			adminApi
				.updateMapper(updateRequest)
				.then(resp => {
					if (resp.success) {
						this.snack = true;
						this.snackColor = "success";
						this.snackText = "Sukses upload data";
					} else {
						this.snack = true;
						this.snackColor = "error";
						this.snackText =
							"File excel yang di unggah mengandung duplikasi pada kolom-2: nomor-indo";
					}
				})
				.finally(() => {
					this.showLoader = false;
					this.showUploadExcel = false;
				});
		};
		fr.readAsArrayBuffer(files);
	}

	exportExcel() {
		try {
			json2excel({
				data: this.customers,
				name: "customer-registration-data",
				formateDate: "yyyy/mm/dd"
			});
		} catch (e) {
			SystemAlert(
				MsgPopupType.Error,
				"Terjadi kesalahan pada server, silahkan coba ulang!"
			);
		}
	}

	openPhoto(imageName) {
		this.dialog = true;
		this.imgUrl = this.baseUrl + imageName;
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
		this.selectedCustomerPDF.psignUrl =
			this.baseUrl + this.selectedCustomerPDF.psign;
		const requestOption = {
			localphone: this.selectedCustomerPDF.phone
		};
		adminApi.getIdPhone(requestOption).then(resp => {
			if (!resp || resp.length === 0) {
				// record not found
				let localmapper = localMapper.filter(item => {
					return item.country === this.selectedCustomerPDF.country;
				});
				if (localmapper.length > 0) {
					this.selectedCustomerPDF.idphone =
						localmapper[0].replace + "__________";
				} else {
					this.selectedCustomerPDF.idphone =
						"+" + this.selectedCustomerPDF.phone;
				}
			} else {
				this.selectedCustomerPDF.idphone = resp[0].idphone;
			}
			this.pdfDialog = true;
		});
	}

	exportPDF() {
		const domElement = document.getElementById("pdf-for-print");
		html2canvas(domElement, {
			dpi: 300, // Set to 300 DPI
			scale: 2,
			useCORS: true
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
				this.selectedCustomerPDF = {};
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
				this.snackText = "Sukses menyimpan data";
			}
		});
	}
	cancel() {
		this.snack = true;
		this.snackColor = "error";
		this.snackText = "Dibatalkan";
	}
	open() {
		this.snack = true;
		this.snackColor = "info";
		this.snackText = "Mengubah";
	}
	close() {}

	mounted() {
		if (process.env.NODE_ENV === "development") {
			this.baseUrl =
				window.location.protocol +
				"//" +
				window.location.hostname +
				":3000/uploads/";
		} else {
			this.baseUrl = "/api/uploads/";
		}

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
	padding: 20px;
	margin: 0 auto;
	/* box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5); */
}
.pdfWrapper {
	padding-right: 20px;
	padding-top: 20px;
	background: white;
	width: 100%;
	height: 100%;
}
.text-justify {
	text-align: justify;
	text-justify: inter-word;
}
</style>
