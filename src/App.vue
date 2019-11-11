<template>
	<v-app class="custom-container">
		<v-alert type="error" v-if="showError">{{showError}}</v-alert>
		<v-alert type="success" v-if="showSuccess">{{showSuccess}}</v-alert>
		<router-view />
	</v-app>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import EventBus from "@/utilities/event-bus";
import * as MessageStatus from "@/models/status/message";

@Component()
export default class App extends Vue {
	showError = "";
	showSuccess = "";

	created() {
		EventBus.$on("system-alert", msg => {
			switch (msg.type) {
				case MessageStatus.MsgPopupType.Error:
					this.showError = msg.message;
					setTimeout(() => {
						this.showError = "";
					}, 2000);
					break;
				case MessageStatus.MsgPopupType.Success:
					this.showSuccess = msg.message;
					setTimeout(() => {
						this.showSuccess = "";
					}, 2000);
					break;

				default:
					break;
			}
		});
	}
}
</script>

<style>
#app {
	font-family: "Avenir", Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}
</style>
