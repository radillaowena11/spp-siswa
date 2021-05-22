<template>
    <!-- partial:partials/_navbar.html -->
 <nav class="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
  <div class="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
    <a class="navbar-brand brand-logo" href=""><img src="assets/images/logo2.png" alt="logo" /></a>
    <a class="navbar-brand brand-logo-mini" href=""><img src="assets/images/logo-mini.png" alt="logo" /></a>
  </div>
  <div class="navbar-menu-wrapper d-flex align-items-stretch">
    <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
      <span class="mdi mdi-menu"></span>
    </button>
        <ul class="navbar-nav navbar-nav-right">
          <li class="nav-item nav-profile dropdown">
            <a
              class="nav-link dropdown-toggle"
              id="profileDropdown"
              href="#"
              data-toggle="dropdown"
              aria-expanded="false"
            >
              <div class="nav-profile-text">
                <p class="mb-1 text-black">Hi, Siswa</p>
              </div>
            </a>
            <div
              class="dropdown-menu navbar-dropdown"
              aria-labelledby="profileDropdown"
            >
              <a class="dropdown-item" @click="logout">
                <i class="mdi mdi-logout mr-2 text-primary"></i> Logout
              </a>
            </div>
          </li>
        </ul>
        <button
          class="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span class="mdi mdi-menu"></span>
        </button>
      </div>
    </nav>
    
  <!-- end navbar -->
</template>

<script>
export default {
  name: "navbar",
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isLoggedIn;
    },
  },
  methods: {
    logout: function () {
      let conf = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("Authorization"),
        },
      };
      let form = new FormData();
      this.axios
        .post("/logout", form, conf)
        .then((response) => {
          if (response.data.logged === false || response.data.status === 0) {
            this.$store.commit("logout");
            localStorage.removeItem("Authorization");
            this.$router.push({ name: "login" });
          }
        })
        .catch((error) => {});
    },
  },
};
</script>