<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-6 col-md-4 col-md-offset-4">
        <div class="account-wall">
          <img class="profile-img" src="@/assets/logo.png" alt />
          <form class="form-signin">
            <input
              type="text"
              class="form-control"
              placeholder="Username"
              v-model="username"
              required
              autofocus
            />
            <input
              type="password"
              class="form-control"
              placeholder="Password"
              v-model="password"
              required
            />
            <button class="btn btn-lg btn-primary btn-block" type="button" @click="login">Sign in</button>
            <span class="clearfix"></span>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import Component from "vue-class-component";
import Cookies from "js-cookie";
import adminApi from "@/api/admin";

@Component()
export default class Login extends Vue {
  username = "";
  password = "";
  login() {
    let usernameReq = this.username;
    let passReq = this.password;

    let requestBody = {
      username: usernameReq,
      password: passReq
    };
    adminApi.login(requestBody).then(resp => {
      if (resp.success) {
        // redirect to dashboard
        Cookies.set("token", resp.token);
        Cookies.set("admin_username", resp.admin_details.username);
        Cookies.set("admin_id", resp.admin_details.id);
        this.$router.push({ name: "admin" });
      }
    });
  }
}
</script>

<style>
.row {
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: normal;
}
.form-signin .form-control {
  position: relative;
  font-size: 16px;
  height: auto;
  padding: 10px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.account-wall {
  margin-top: 20px;
  padding: 40px 0px 20px 0px;
  background-color: #f7f7f7;
  -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.login-title {
  color: #555;
  font-size: 18px;
  font-weight: 400;
  display: block;
}
.profile-img {
  width: 80%;
  height: 96px;
  margin: 0 auto 10px;
  display: block;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
  border-radius: 50%;
}
.need-help {
  margin-top: 10px;
}
.new-account {
  display: block;
  margin-top: 10px;
}
</style>