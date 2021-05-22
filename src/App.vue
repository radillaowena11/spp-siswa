<template>
  <div id="app">
    <div class="container-scroller">
      <router-view name="header" />
      <div class="container-fluid page-body-wrapper">
        <router-view name="sidebar" />
        <router-view />
      </div>
      <router-view name="footer" />
    </div>
  </div>
</template>



<script>
import Navbar from "./views/Layouts/Navbar";
import Footer from "./views/Layouts/Footer";
import Sidebar from "./views/Layouts/Sidebar";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
    Sidebar,
  },
  data: function () {
    return {
      status_login: "",
    };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
