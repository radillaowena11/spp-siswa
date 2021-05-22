<template>
      <div class="container-fluid page-body-wrapper full-page-wrapper">
        <div class="content-wrapper d-flex align-items-center auth">
          <div class="row flex-grow">
            <div class="col-lg-4 mx-auto">
              <div class="auth-form-light text-left p-5">
                <div class="brand-logo">
                  <img src="assets/images/logo2.png">
                </div>
                <h4>Selamat Datang!</h4>
                <h6 class="font-weight-light">Login untuk Pembayaran SPP.</h6>
                <form v-on:submit.prevent="Login" class="pt-3" method="post">
                  <div class="form-group">
                    <input v-model="username" type="text" class="form-control form-control-lg" id="username" name="username" placeholder="Username" required>
                  </div>
                  <div class="form-group">
                    <input v-model="password" type="password" class="form-control form-control-lg" id="exampleInputPassword1" name="password" placeholder="Password" required>
                  </div>
                  <div class="mt-3">
                    <input type="submit" name="submit" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn" value="MASUK">
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      

</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    Login: function () {
      let username = this.username;
      let password = this.password;
      this.$store
        .dispatch("login", { username, password })
        .then(() => this.$router.push("/pembayaran"))
        .catch((err) => console.log(err));
    },
  },
};
</script>