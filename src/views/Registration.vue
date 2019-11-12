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
							type="number"
							:counter="30"
							:rules="phoneRules"
							label="Nomor Telpon"
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
							v-model="nik"
							prepend-icon="mdi-account-card-details"
							type="number"
							:counter="16"
							:rules="nikRules"
							label="Nomor Induk Kependudukan (NIK)"
							required
						></v-text-field>
						<div class="subheading text-left">Contoh:</div>
						<v-img :src="kkexUrl" height="200" :contain="true" style="margin-left:5px;margin-right:5px;" />
						<v-text-field
							v-model="nokk"
							prepend-icon="mdi-account-card-details"
							type="number"
							:counter="16"
							:rules="nokkRules"
							label="Nomor Kartu Keluarga (NOKK)"
							required
						></v-text-field>
						<v-img :src="pkkUrl" height="150" v-if="pkkUrl" style="margin-left:5px;margin-right:5px;" />
						<v-file-input
							show-size
							:rules="rules"
							ref="pkkInput"
							v-model="pkk"
							@change="onPKKPicked"
							accept="image/png, image/jpeg, image/bmp"
							prepend-icon="mdi-camera"
							label="Foto Kartu Keluarga"
						></v-file-input>
						<v-img :src="pktpUrl" height="150" v-if="pktpUrl" style="margin-left:5px;margin-right:5px;" />
						<v-file-input
							show-size
							v-model="pktp"
							:rules="rules"
							ref="pktpInput"
							@change="onPKTPPicked"
							accept="image/png, image/jpeg, image/bmp"
							prepend-icon="mdi-camera"
							label="Foto e-KTP"
						></v-file-input>
					</v-form>
				</v-card>
				<v-btn color="green" @click="submitFirst" style="margin-top:-10px; margin-bottom:5px;">Lanjut</v-btn>
				<v-btn text @click="clear" style="margin-top:-10px; margin-bottom:5px;">Hapus</v-btn>
			</v-stepper-content>
			<v-stepper-step :complete="steps > 2" color="red accent-4" step="2">Surat kuasa</v-stepper-step>

			<v-stepper-content step="2">
				<v-card color="grey lighten-4" class="mb-12" height="auto">
					<v-list dense>
						<v-list-item>
							<v-list-item-content class="text-left">Surat Pernyataan:</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content class="text-left">Saya yang bertandatangan dibawah ini,</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>account_box</v-icon>
							</v-list-item-icon>
							<v-list-item-content>Nama: {{name}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>mdi-account-card-details</v-icon>
							</v-list-item-icon>
							<v-list-item-content>NIK: {{nik}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-icon>
								<v-icon>phone</v-icon>
							</v-list-item-icon>
							<v-list-item-content>No Kartu As: {{phone}}</v-list-item-content>
						</v-list-item>
						<v-list-item>
							<v-list-item-content
								class="text-left"
							>Bersedia memberikan kuasa kepada Telin {{country}} untuk melakukan registrasi nomor Kartu As Telkomsel</v-list-item-content>
						</v-list-item>
					</v-list>
				</v-card>
				<v-btn color="green" @click="register">Setuju</v-btn>
				<v-btn text @click="steps = 1">Kembali</v-btn>
			</v-stepper-content>
		</v-stepper>
		<v-overlay :value="showLoader">
			<v-progress-circular indeterminate size="70"></v-progress-circular>
		</v-overlay>
	</v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import { SystemAlert } from "@/utilities/event-bus";
import { MsgPopupType } from "@/models/status/message";
import registrationApi from "@/api/registration";
import countryMapper from "@/models/json/country.json";
import kk from "@/assets/kk.jpg";
import ktp from "@/assets/ktp.jpg";

@Component()
export default class Login extends Vue {
	country = "";
	showLoader = false;
	pkkUrl = "";
	pktpUrl = "";
	kkexUrl = kk;
	ktpexUrl = ktp;
	pktp = [];
	pkk = [];
	steps = 1;
	valid = true;
	name = "";
	nameRules = [
		v => !!v || "Harap isi nama anda",
		v => (v && v.length <= 50) || "Nama harus kurang dari 50 karakter"
	];
	phone = "";
	phoneRules = [
		v => {
			if (v) return true;
			return "Harap isi nomor telpon anda";
		},
		v => {
			if (this.mapCountry(v)) return true;
			return "Nomor telpon bukan nomor Kartu As";
		},
		v =>
			(v && v.length <= 30) ||
			"Nomor telpon harus kurang dari 30 karakter"
	];
	nik = "";
	nikRules = [
		v => !!v || "Harap isi NIK anda",
		v => (v && v.length <= 16) || "NIK harus kurang dari 16 karakter"
	];
	nokk = "";
	nokkRules = [
		v => !!v || "Harap isi NOKK anda",
		v => (v && v.length <= 16) || "NOKK harus kurang dari 16 karakter"
	];
	rules = [
		value => {
			if (!value) {
				return true;
			}
			if (value.size >= 2000000) {
				return "Foto yang diupload tidak boleh melebihi 2 MB!";
			}
			return true;
		}
	];

	register() {
		this.showLoader = true;
		this.steps = 3;
		let formData = new FormData();
		formData.append("name", this.name);
		formData.append("phone", this.phone);
		formData.append("nik", this.nik);
		formData.append("nokk", this.nokk);
		formData.append("status", "pending");
		formData.append("country", this.country);
		formData.append("pkk", this.pkk);
		formData.append("pktp", this.pktp);
		registrationApi
			.register(formData)
			.then(resp => {
				if (resp.success) {
					SystemAlert(
						MsgPopupType.Success,
						"Pengumpulan surat kuasa berhasil"
					);
				} else {
					this.steps = 2;
					SystemAlert(
						MsgPopupType.Error,
						"Terjadi kesalahan pada server, silahkan kumpulkan ulang!"
					);
				}
			})
			.catch(() => {
				this.steps = 2;
				SystemAlert(
					MsgPopupType.Error,
					"Terjadi kesalahan pada server, silahkan kumpulkan ulang!"
				);
			})
			.finally(() => {
				this.clear();
				this.showLoader = false;
			});
	}

	clear() {
		this.steps = 1;
		this.$refs.form.resetValidation();
		this.$refs.form.reset();
		this.pkk = undefined;
		this.pktp = undefined;
	}

	onPKKPicked(files) {
		if (!this.$refs.pkkInput.validate()) return;
		if (files && files.name) {
			const fr = new FileReader();
			fr.readAsDataURL(files);
			fr.addEventListener("load", () => {
				this.pkkUrl = fr.result;
			});
		} else {
			this.pkkUrl = "";
		}
	}

	onPKTPPicked(files) {
		if (!this.$refs.pktpInput.validate()) return;
		if (files && files.name) {
			const fr = new FileReader();
			fr.readAsDataURL(files);
			fr.addEventListener("load", () => {
				this.pktpUrl = fr.result;
			});
		} else {
			this.pktpUrl = "";
		}
	}

	submitFirst() {
		if (this.$refs.form.validate()) {
			if (
				(this.pkk && this.pkk.length > 0) ||
				(this.pktp && this.pktp.length > 0) ||
				(this.pkk && this.pkk.name) ||
				(this.pktp && this.pktp.name)
			) {
				this.steps = 2;
			} else {
				SystemAlert(
					MsgPopupType.Error,
					"Tolong upload Foto KK atau Foto e-KTP"
				);
			}
		}
	}

	mapCountry(numb) {
		if (!numb) return false;
		numb = numb.toString();
		let found = false;
		countryMapper.forEach(element => {
			element.prefix.forEach(prefix => {
				if (
					numb.indexOf(prefix) === 0 &&
					numb.length === element.total &&
					!found
				) {
					found = true;
					this.country = element.country;
				}
			});
		});
		return found;
	}
}
</script>
<style>
.custom-container {
	margin: 0 auto;
	width: 100%;
	max-width: 700px;
}
</style>