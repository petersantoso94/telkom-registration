<template>
	<v-app id="inspire">
		<v-app-bar color="red accent-4" max-height="65" dark>
			<img height="40" src="@/assets/logo.png" alt style="margin-right:5px;" />
			<v-toolbar-title height="60" class="font-weight-bold">Telin {{country}} - Form Registrasi</v-toolbar-title>
		</v-app-bar>
		<v-stepper v-model="steps" vertical>
			<v-stepper-step
				:complete="steps > 1"
				color="red accent-4"
				step="1"
			>Upload dokumen yang diperlukan</v-stepper-step>
			<v-stepper-content step="1">
				<v-card color="grey lighten-4" class="mb-12" height="auto">
					<v-form style="padding:5px 10px" ref="form" v-model="valid" lazy-validation>
						<v-text-field
							v-model="name"
							:counter="50"
							prepend-icon="account_box"
							:rules="nameRules"
							label="Nama"
							required
						></v-text-field>
						<v-text-field
							v-model="phone"
							prepend-icon="phone"
							:prefix="phonePrefix"
							type="number"
							oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							:maxlength="phoneMaxLength"
							:counter="phoneMaxLength"
							:rules="phoneRules"
							label="Nomor Telpon"
							required
						></v-text-field>
						<v-text-field
							v-model="nik"
							prepend-icon="mdi-account-card-details"
							type="number"
							oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							maxlength="16"
							:counter="16"
							:rules="nikRules"
							label="Nomor Induk Kependudukan (NIK)"
							required
						></v-text-field>
						<div class="subheading text-left">Contoh:</div>
						<v-img
							:src="ktpexUrl"
							:contain="true"
							height="200"
							style="margin-left:5px;margin-right:5px;"
						/>
						<v-text-field
							v-model="nokk"
							prepend-icon="mdi-account-card-details"
							type="number"
							oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
							maxlength="16"
							:counter="16"
							:rules="nokkRules"
							label="Nomor Kartu Keluarga (NOKK)"
							required
						></v-text-field>
						<div class="subheading text-left">Contoh:</div>
						<v-img :src="kkexUrl" height="200" :contain="true" style="margin-left:5px;margin-right:5px;" />

						<v-file-input
							show-size
							:rules="rulespkk"
							ref="pkkInput"
							v-model="pkk"
							@change="onPKKPicked"
							accept="image/png, image/jpeg, image/bmp"
							prepend-icon="mdi-camera"
							label="Foto Kartu Keluarga"
							required
						></v-file-input>
						<v-img
							:src="pkkUrl"
							height="150"
							:contain="true"
							v-if="pkkUrl"
							style="margin-left:5px;margin-right:5px;"
						/>
						<v-file-input
							show-size
							v-model="pktp"
							:rules="rulespktp"
							ref="pktpInput"
							@change="onPKTPPicked"
							accept="image/png, image/jpeg, image/bmp"
							prepend-icon="mdi-camera"
							label="Foto e-KTP"
						></v-file-input>
						<v-img
							:src="pktpUrl"
							height="150"
							:contain="true"
							v-if="pktpUrl"
							style="margin-left:5px;margin-right:5px;"
						/>
					</v-form>
				</v-card>
				<v-btn
					outlined
					color="success"
					@click="submitFirst"
					style="margin-top:-10px; margin-bottom:5px;"
				>Lanjut</v-btn>
				<v-btn text @click="clear" style="margin-top:-10px; margin-bottom:5px;">Hapus</v-btn>
			</v-stepper-content>

			<v-stepper-step :complete="steps > 2" color="red accent-4" step="2">Surat kuasa</v-stepper-step>
			<v-stepper-content step="2">
				<v-card
					color="grey lighten-4"
					class="mb-12"
					height="auto"
					style="font-size:80%;margin-top:-10px"
				>
					<v-list dense>
						<v-list-item>
							<p
								class="text-left text-justify"
							>Saya, yang bertanda tangan di bawah ini, menyatakan dengan hormat mengajukan permohonan bantuan kepada Bagian Pelayanan Pelanggan Telkomsel (“GraPARI”) untuk melakukan registrasi nomor As2in1 atas nama saya di bawah ini:</p>
						</v-list-item>
						<v-container style="margin-left:5px;margin-top:-15px">
							<v-row no-gutters>
								<v-col cols="4" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>Nama</v-card>
								</v-col>
								<v-col cols="6" sm="4">
									<v-card
										class="text-left text-capitalize"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{name}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="4" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>No. As2in1</v-card>
								</v-col>
								<v-col cols="7" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{phone}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="4" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>No. KTP</v-card>
								</v-col>
								<v-col cols="7" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{nik}}</v-card>
								</v-col>
							</v-row>
							<v-row no-gutters>
								<v-col cols="4" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>No. KK</v-card>
								</v-col>
								<v-col cols="7" sm="4">
									<v-card
										class="text-left"
										style="box-shadow: 0px 0px 0px #FFFFFF !important;"
										:flat="true"
									>: {{nokk}}</v-card>
								</v-col>
							</v-row>
						</v-container>
						<v-list-item>
							<p
								class="text-left text-justify"
							>Untuk keperluan registrasi pelanggan jasa telekomunikasi sebagaimana diatur dalam ketentuan peraturan perundangan-undangan.</p>
						</v-list-item>
						<v-list-item>
							<p
								class="text-left text-justify"
							>Data-data yang disampaikan di atas adalah benar. Apabila saya memberikan data yang tidak sesuai dan bertentangan dengan peraturan perundang-undangan, maka saya bersedia menerima segala konsekuensi yang berlaku.</p>
						</v-list-item>
						<v-list-item>
							<p
								class="text-left text-justify"
							>Saya secara berkala akan melakukan registrasi ulang untuk memastikan bahwa data-data yang saya sampaikan tervalidasi.</p>
						</v-list-item>
					</v-list>
					<v-list-item style="margin-top:-15px">
						<v-list-item-content class="text-left">Tanda Tangan:</v-list-item-content>
					</v-list-item>
					<VueSignaturePad
						id="signature"
						width="100%"
						height="400px"
						ref="signaturePad"
						:options="options"
					/>
					<v-row style="margin-left:-5px">
						<v-card-actions class="align-left" style="margin-top:10px">
							<v-btn class="ma-1" small dark outlined color="grey" @click="undoSign">
								<v-icon left>mdi-undo</v-icon>Undo
							</v-btn>
						</v-card-actions>
					</v-row>
				</v-card>
				<v-btn outlined color="success" @click="register">Setuju</v-btn>
				<v-btn text @click="steps--">Kembali</v-btn>
			</v-stepper-content>
		</v-stepper>
		<v-dialog v-model="showSignPad" max-width="600"></v-dialog>
		<v-snackbar v-model="snack" :timeout="2000" :color="snackColor">
			{{ snackText }}
			<v-btn text @click="snack = false">Tutup</v-btn>
		</v-snackbar>
		<v-overlay :value="showLoader">
			<v-progress-circular indeterminate size="70"></v-progress-circular>
		</v-overlay>
	</v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import registrationApi from "@/api/registration";
import countryMapper from "@/models/json/country.json";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import kk from "@/assets/kk.jpg";
import ktp from "@/assets/ktp.jpg";

@Component()
export default class Login extends Vue {
	maxSize = 10000000; // 10 mb
	errorMaxSize = "10 MB";
	phoneMaxLength = 30;
	phoneExample = "";
	country = "";
	phonePrefix =
		window.document.location.hostname.split(".")[0] === "regapps"
			? "+"
			: "";
	showLoader = false;
	showSignPad = false;
	snack = false;
	snackColor = "";
	snackText = "";
	pkkUrl = "";
	pktpUrl = "";
	kkexUrl = kk;
	ktpexUrl = ktp;
	pktp = [];
	pkk = [];
	psign = [];
	pkkFile = [];
	pktpFile = [];
	steps = 1;
	valid = true;
	name = "";
	options = {
		penColor: "black"
	};
	nameRules = [
		v => !!v || "Harap isi nama anda",
		v => (v && v.length <= 50) || "Nama harus kurang dari 50 huruf"
	];
	phone = "";
	phoneRules = [
		v => {
			if (v) return true;
			return "Harap isi nomor telpon anda";
		},
		v => {
			if (window.document.location.hostname.split(".")[0] === "regapps") {
				let phonenumb = parsePhoneNumberFromString("+" + v);
				if (!phonenumb || !phonenumb.isValid())
					return "Nomor telpon yang dimasukkan tidak valid. Masukkan kode negara valid dan nomor telpon anda, contoh +852xxxxxx";
				return true;
			} else {
				if (this.mapCountry(v)) return true;
				return `Masukkan Nomor As2In1 ${
					this.mapSubdomain().country
				} yang anda gunakan tanpa country code (misal : ${
					this.mapSubdomain().local
				})`;
			}
		},
		v => (v && v.length <= 30) || "Nomor telpon harus kurang dari 30 angka"
	];
	nik = "";
	nikRules = [
		v => !!v || "Harap isi NIK anda",
		v => (v && v.length === 16) || "NIK harus terdiri dari 16 angka"
	];
	nokk = "";
	nokkRules = [
		v => !!v || "Harap isi NOKK anda",
		v => (v && v.length === 16) || "NOKK harus terdiri dari 16 angka"
	];
	rulespktp = [
		value => {
			if (!value) {
				return true;
			}
			if (value.size >= this.maxSize) {
				return `Foto yang diupload tidak boleh melebihi ${this.errorMaxSize}!`;
			}
			return true;
		}
	];
	rulespkk = [
		value => {
			if (!value) {
				return "Harap isi foto keluarga anda";
			}
			return true;
		},
		value => {
			if (!value || value.size >= this.maxSize) {
				return `Foto yang diupload tidak boleh melebihi ${this.errorMaxSize}!`;
			}
			return true;
		}
	];

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

	mounted() {
		this.country = this.mapSubdomain().country;
		this.phoneMaxLength = this.mapSubdomain().total;
		this.phoneExample = this.mapSubdomain().local;
	}

	register() {
		this.showLoader = true;
		if (!this.submitSign()) {
			this.showLoader = false;
			return;
		}
		if (window.document.location.hostname.split(".")[0] === "regapps") {
			this.country = parsePhoneNumberFromString("+" + this.phone).country;
		}
		this.steps = 3;
		let formData = new FormData();
		formData.append("name", this.name);
		formData.append("phone", this.phone);
		formData.append("nik", this.nik);
		formData.append("nokk", this.nokk);
		formData.append("status", "pending");
		formData.append("country", this.country);
		formData.append("pkk", this.pkkFile);
		formData.append("pktp", this.pktpFile);
		formData.append("psign", this.psign);
		registrationApi
			.register(formData)
			.then(resp => {
				if (resp.success) {
					this.snack = true;
					this.snackColor = "success";
					this.snackText = "Pengumpulan surat kuasa berhasil";
				} else {
					this.steps = 2;

					this.snack = true;
					this.snackColor = "error";
					this.snackText =
						"Terjadi kesalahan pada server, silahkan kumpulkan ulang!";
				}
			})
			.catch(() => {
				this.steps = 2;
				this.snack = true;
				this.snackColor = "error";
				this.snackText =
					"Terjadi kesalahan pada server, silahkan kumpulkan ulang!";
			})
			.finally(() => {
				this.clear();
				this.showLoader = false;
			});
	}

	clear() {
		this.steps = 1;
		this.$refs.form.resetValidation();
		this.$refs.signaturePad.clearSignature();
		this.$refs.form.reset();
		this.pkk = undefined;
		this.pktp = undefined;
		this.pkkFile = [];
		this.pktpFile = [];
	}

	onPKKPicked(files) {
		if (!this.$refs.pkkInput.validate()) {
			this.pkkUrl = "";
			return;
		}
		if (files && files.name) {
			this.resizeImage(files).then(dataurl => {
				this.pkkFile = this.dataUrlToBlob(dataurl);
				this.pkkUrl = dataurl;
			});
		} else {
			this.pkkUrl = "";
			this.pkkFile = [];
		}
	}

	onPKTPPicked(files) {
		if (!this.$refs.pktpInput.validate()) {
			this.pktpUrl = "";
			return;
		}
		if (files && files.name) {
			this.resizeImage(files).then(dataurl => {
				this.pktpFile = this.dataUrlToBlob(dataurl);
				this.pktpUrl = dataurl;
			});
		} else {
			this.pktpUrl = "";
			this.pktpFile = [];
		}
	}

	//return blob and dataurl
	resizeImage(files) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			const canvas = document.createElement("canvas");
			img.onload = () => {
				try {
					const MAX_WIDTH = 800;
					const MAX_HEIGHT = 600;
					let width = img.width;
					let height = img.height;

					if (width > height) {
						if (width > MAX_WIDTH) {
							height *= MAX_WIDTH / width;
							width = MAX_WIDTH;
						}
					} else {
						if (height > MAX_HEIGHT) {
							width *= MAX_HEIGHT / height;
							height = MAX_HEIGHT;
						}
					}
					canvas.width = width;
					canvas.height = height;
					let ctx = canvas.getContext("2d");
					ctx.drawImage(img, 0, 0, width, height);
					let dataurl = canvas.toDataURL("image/png");
					resolve(dataurl);
				} catch (error) {
					reject(error);
				}
			};
			const fr = new FileReader();
			fr.readAsDataURL(files);
			fr.addEventListener("load", () => {
				img.src = fr.result;
			});
		});
	}

	dataUrlToBlob(dataurl) {
		// Split the base64 string in data and contentType
		const block = dataurl.split(";");
		// Get the content type of the image
		const contentType = block[0].split(":")[1];
		// get the real base64 content of the file
		const realData = block[1].split(",")[1];
		// Convert it to a blob to upload
		const blob = this.b64toBlob(realData, contentType);
		return blob;
	}

	submitFirst() {
		if (this.$refs.form.validate()) {
			if (
				(this.pkk && this.pkk.length > 0) ||
				(this.pkk && this.pkk.name)
			) {
				this.steps++;
			} else {
				this.snack = true;
				this.snackColor = "error";
				this.snackText = "Tolong upload Foto KK";
			}
		}
	}

	undoSign() {
		this.$refs.signaturePad.undoSignature();
	}

	submitSign() {
		const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
		if (isEmpty) {
			this.snack = true;
			this.snackColor = "error";
			this.snackText = "Tolong tanda tangan pada kotak yang disediakan";
			this.showLoader = false;
			return false;
		}

		this.psign = this.dataUrlToBlob(data);
		return true;
	}

	mapCountry(numb) {
		if (!numb) return false;
		numb = numb.toString();
		let found = false;
		countryMapper.forEach(element => {
			element.prefix.forEach(prefix => {
				if (
					this.country === element.country &&
					numb.indexOf(prefix) === 0 &&
					numb.length === element.total &&
					!found
				) {
					found = true;
				}
			});
		});
		return found;
	}

	b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || "";
		sliceSize = sliceSize || 512;

		let byteCharacters = atob(b64Data);
		let byteArrays = [];

		for (
			let offset = 0;
			offset < byteCharacters.length;
			offset += sliceSize
		) {
			let slice = byteCharacters.slice(offset, offset + sliceSize);

			let byteNumbers = new Array(slice.length);
			for (let i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			let byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		let blob = new Blob(byteArrays, { type: contentType });
		return blob;
	}
}
</script>
<style>
.custom-container {
	margin: 0 auto;
	width: 100%;
	max-width: 700px;
}
#signature {
	border: solid 1px black;
	border-radius: 5px;
}
.text-justify {
	text-align: justify;
	text-justify: inter-word;
}
</style>