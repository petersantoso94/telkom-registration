<template>
	<v-app id="inspire">
		<v-tabs v-model="tab" fixed-tabs background-color="indigo" dark>
			<v-tab :href="`#customers`">Customers</v-tab>
			<v-tab :href="`#admins`" v-if="isSuperAdmin">Admins</v-tab>

			<v-tab-item :value="'customers'">
				<v-card>
					<v-card-title>
						Customers List
						<v-spacer></v-spacer>
						<v-spacer></v-spacer>
						<v-btn class="ma-2" tile outlined color="success" @click="exportExcel">
							<v-icon left>mdi-export</v-icon>Export CSV
						</v-btn>
						<v-btn class="ma-2" tile outlined color="success" @click="exportAllPDF">
							<v-icon left>mdi-export</v-icon>Export PDF
						</v-btn>
						<v-btn
							v-if="isSuperAdmin"
							class="ma-2"
							tile
							outlined
							color="success"
							@click="showUploadExcel = true"
						>
							<v-icon left>mdi-import</v-icon>Import Mapping
						</v-btn>
						<v-spacer></v-spacer>
						<v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
					</v-card-title>
					<v-data-table
						v-model="selectedCustomer"
						:headers="headers"
						:items="customers" show-select
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
			</v-tab-item>

			<v-tab-item :value="'admins'">
				<v-card>
					<v-card-title>
						Admins List
						<v-spacer></v-spacer>
						<v-btn color="primary" dark class="mb-2" @click="showInsertAdmin = true">New Admin</v-btn>
						<v-spacer></v-spacer><v-text-field
							v-model="searchAdmin"
							append-icon="search"
							label="Search"
							single-line
							hide-details
						></v-text-field>
					</v-card-title>
					<v-data-table
						:headers="headersAdmin"
						:items="admins"
						:search="searchAdmin"
						item-key="id"
						class="elevation-1"
					>
						<template v-slot:item.updated_at="{ item }">
							<v-icon small @click="deleteAdmin(item)">delete</v-icon>
						</template>
						<template v-slot:item.country="{ item }">
							<v-edit-dialog @save="saveAdmin(item)" @cancel="cancel" @open="open" @close="close">
								<v-chip dark>{{ item.country }}</v-chip>
								<template v-slot:input>
									<v-select
										v-model="item.country"
										:hint="`tekan 'enter' untuk menyimpan`"
										:items="selectCountry"
										item-text="text"
										item-value="value"
										label="roles"
										persistent-hint
										return-value
										single-line
									></v-select>
								</template>
							</v-edit-dialog>
						</template>
					</v-data-table>
				</v-card>
			</v-tab-item>
		</v-tabs>
		<v-dialog v-model="showInsertAdmin" max-width="500px">
			<v-card>
				<v-card-title>
					<span class="headline">Tambah Admin</span>
				</v-card-title>

				<v-card-text>
					<v-container>
						<v-form ref="form" lazy-validation>
						<v-row>
							
							<v-col cols="12" sm="6" md="4">
								<v-text-field :rules="nameRules" v-model="newAdmin.username" label="Username"></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
								<v-text-field
									v-model="newAdmin.password"
									:append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
									:rules="[rules.required, rules.min]"
									:type="showPass ? 'text' : 'password'"
									name="input-10-1"
									label="Password"
									ref="adminPasswordInput"
									hint="At least 8 characters"
									counter
									@click:append="showPass = !showPass"
								></v-text-field>
							</v-col>
							<v-col cols="12" sm="6" md="4">
							<v-select
										v-model="newAdmin.country"
										:items="selectCountry"
										:rules="nameRules"
										item-text="text"
										item-value="value"
										label="Roles"
										persistent-hint
										return-value
										single-line
									></v-select>
									</v-col>
						</v-row>
							</v-form>
					</v-container>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" text @click="showInsertAdmin = false">Batal</v-btn>
					<v-btn color="blue darken-1" text @click="addAdmin">Simpan</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
						selectedCustomerPDFs =[];
						pdfDialog = false;}">
						<v-icon>mdi-close</v-icon>
					</v-btn>
					<v-toolbar-title>Surat Kuasa dari: {{selectedCustomerPDFs.length === 1?selectedCustomerPDFs[0].name:"All"}}</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-toolbar-items>
						<v-btn dark text @click="exportPDF">Export</v-btn>
					</v-toolbar-items>
				</v-toolbar>
				<v-list dense id="pdf-for-print">
					<div class="pdfWrapper pdfa4paper" v-for="selectedCustomerPDF in selectedCustomerPDFs" :key="selectedCustomerPDF.id">
						<v-card
							class="d-flex flex-row justify-end"
							style="box-shadow: 0px 0px 0px #FFFFFF !important;"
							:flat="true"
						>
							<v-img
								class="align-end"
								:eager="true"
								:src="telinImg[selectedCustomerPDF.country]"
								height="200"
								max-width="200"
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
								:eager="true"
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
import countryMapper from "@/models/json/country.json";
import { json2excel } from "js2excel";
import XLSX from "xlsx";
import telinHk from "@/assets/telin-Hongkong.jpg";
import telinMalay from "@/assets/telin-Malaysia.jpg";
import telinTw from "@/assets/telin-Taiwan.jpg";
import localMapper from "@/models/json/country.json";

@Component()
export default class Login extends Vue {
	md5 = require('md5');
	snack = false;
	dialog = false;
	pdfDialog = false;
	showUploadExcel = false;
	showLoader = false;
	isSuperAdmin = false;
	showInsertAdmin = false;
	showPass = false;
	baseUrl = "";
	tab = null;
	isExportAllPDF = false;
	selectedCustomer = [];
	imgUrl = "";
	newAdmin = {};
	telinImg = {
		Taiwan: telinTw,
		Malaysia: telinMalay,
		Hongkong: telinHk
	};
	selectStatus = ["approved", "rejected", "pending"];
	selectCountry = ["Hongkong", "Malaysia", "Taiwan", "Apps", "All"];
	selectedCustomerPDFs = [];
	snackColor = "";
	snackText = "";
	localnumber = [];
	idnumber = [];
	arr_admin = [];
	singleSelect = false;
	search = "";
	searchAdmin = "";
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
	headersAdmin = [
		{
			text: "id",
			align: "left",
			value: "id"
		},
		{ text: "Username", value: "username" },
		{ text: "Role", value: "country" },
		{ text: "Actions", value: "updated_at" }
	];
	customers = [];
	admins = [];

	rules = {
		required: value => !!value || "required",
		min: v => v&&v.length >= 8 || "Min 8 characters"
	};
	nameRules = [
		v => !!v || "required"
	];

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

	exportAllPDF(){
		if(this.selectedCustomer.length > 50){
			this.snack = true;
			this.snackColor = "error";
			this.snackText = "Tidak bisa export lebih dari 50 data";
			return;
		}
		if(this.selectedCustomer.length === 0 ){
			this.snack = true;
			this.snackColor = "error";
			this.snackText = "Minimal export 1 data";
			return;
		}
		this.isExportAllPDF = true;
		this.showLoader = true;
		this.selectedCustomerPDFs = []
		this.selectedCustomer.forEach(async (item)=>{
			await this.showPDF(item.id)
		})
	}

	showPDF(id) {
		let selectedCustomerPDF = this.customers.filter(item => {
			return item.id === id;
		})[0];
		selectedCustomerPDF.psignUrl =
			this.baseUrl + selectedCustomerPDF.psign;
		const requestOption = {
			localphone: selectedCustomerPDF.phone
		};
		adminApi.getIdPhone(requestOption).then(resp => {
			if (!resp || resp.length === 0) {
				// record not found
				let localmapper = localMapper.filter(item => {
					return item.country === selectedCustomerPDF.country;
				});
				if (localmapper.length > 0) {
					selectedCustomerPDF.idphone =
						localmapper[0].replace + "__________";
				} else {
					selectedCustomerPDF.idphone =
						"+" + selectedCustomerPDF.phone;
				}
			} else {
				selectedCustomerPDF.idphone = resp[0].idphone;
			}
			this.selectedCustomerPDFs.push(selectedCustomerPDF)
			this.pdfDialog = true;
			if(this.isExportAllPDF && this.selectedCustomerPDFs.length === this.selectedCustomer.length){
				// all request done
				setTimeout(() => {
					this.exportPDF()
				}, 200*this.selectedCustomer.length);
			}else{
				if(!this.isExportAllPDF){
					this.showLoader = false;
				}
			}

			return Promise.resolve("true")
		});
	}

	mapSubdomain() {
		let selectedCountry = {};
		switch (window.document.location.hostname.split(".")[0]) {
			case "reghk":
				selectedCountry = countryMapper[2];

				break;
			case "regtw":
				selectedCountry = countryMapper[1];
				break;
			case "regmy":
				selectedCountry = countryMapper[0];
				break;
			case "regapps":
				selectedCountry = {
					country: "Apps",
					total: 30,
					local: "+85282xxxxx"
				};
				break;
			default:
				break;
		}
		return selectedCountry;
	}

	exportPDF() {
		this.showLoader =true;
		const pdf = new jsPdf("p", "mm", "a4");		
		const domElements = document.querySelectorAll(".pdfa4paper");
		const position = 0;
		const imgWidth = 211
		let counter = 0;
		domElements.forEach(async element => {
			const imgPage = await html2canvas(element, {
				dpi: 300, // Set to 300 DPI
				scale: 0.9,
				useCORS: true
			})
			if(counter !== 0)
				pdf.addPage();
			let contentDataURL = await imgPage.toDataURL('image/png');
			let imgHeight = imgPage.height * imgWidth / imgPage.width;
			pdf.addImage(contentDataURL, "JPEG", 0 , position , imgWidth, imgHeight,undefined,'FAST');
			if(domElements.length -1  === counter){
				const pdfName =(this.isExportAllPDF?(this.mapSubdomain().country + ".pdf"):(this.selectedCustomerPDFs[0].country +
						"-" +
						this.selectedCustomerPDFs[0].phone +
						".pdf"))
				pdf.save(
					pdfName
				);
				this.showLoader = false;
				this.selectedCustomerPDFs = [];
				this.selectedCustomer = [];
				this.pdfDialog = false;
				this.isExportAllPDF = false;
			}
			counter++;
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

	saveAdmin(param) {
		let { country, id } = param;
		let updateAdminRequest = {
			country: country,
			id: id,
			admin_id: this.adminDetail.id
		};

		adminApi.updateAdminRole(updateAdminRequest).then(resp => {
			if (resp.success) {
				this.snack = true;
				this.snackColor = "success";
				this.snackText = "Sukses menyimpan data";
			}
		});
	}

	deleteAdmin(param) {
		if (confirm("Are you sure you want to delete this admin?")) {
			const index = this.admins.indexOf(param);
			let { id } = param;
			let deleteAdminRequest = {
				id: id,
				admin_id: this.adminDetail.id
			};
			adminApi.deleteAdmin(deleteAdminRequest).then(resp => {
				if (resp.success) {
					this.admins.splice(index, 1);
					this.snack = true;
					this.snackColor = "success";
					this.snackText = "Sukses menghapus data admin";
				}
			});
		}
	}

	addAdmin(){
		if (this.$refs.form.validate()) {
		let addAdminRequest = {
				username: this.newAdmin.username,
				password: this.md5(this.newAdmin.password),
				country: this.newAdmin.country,
				admin_id: this.adminDetail.id
			};
			adminApi.addAdmin(addAdminRequest).then(resp => {
				if (resp.success) {
					this.newAdmin = {}
					this.showInsertAdmin = false
					this.$refs.form.resetValidation();
					this.getAdminList()
					this.snack = true;
					this.snackColor = "success";
					this.snackText = "Sukses menambahkan data admin";
				}
			});
		}
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

	getAdminList() {
		adminApi.getAdmins().then(resp => {
			this.admins = resp;
		});
	}

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

		this.isSuperAdmin = Cookies.get("admin_id") === "1";

		this.adminDetail = {
			username: Cookies.get("admin_username") || "admin",
			id: Cookies.get("admin_id") || "1"
		};
		adminApi.getCustomers().then(resp => {
			this.customers = resp;
		});
		if (this.isSuperAdmin) {
			this.getAdminList();
		}
	}
}
</script>

<style>
.pdfWrapper {
	background: white;
	width: 100%;
	height: 100%;
}
.pdfa4paper {
	width: 22cm;
	height: 30cm;
	display: block;
	padding-left: 30mm;
	padding-right: 30mm;
	padding-top: -20mm;
	margin: 0 auto;
	/* box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5); */
}
.text-justify {
	text-align: justify;
	text-justify: inter-word;
}
body{
	overflow-y: scroll;
}

@media print {
  .pdfa4paper 
  {
   page-break-after:always;
  }
 }
</style>
