<template>
  <div class="main-panel">
    <div class="content-wrapper">
      <div class="row">
        <div class="col-lg-12 grid-margin stretch-card">
          <div class="card">
            <div class="card-body">
              <h4 class="card-title">Data Tanggungan</h4>
              <p class="card-description float-right"></p>
              <div class="table-responsive">
                <b-table striped hover :items="myspp" :fields="fieldsSpp">
                  <template v-slot:cell(bulan)="data">
                    {{ months[data.item.bulan - 1] }}
                  </template>
                  <template v-slot:cell(Aksi)="data">
                    <b-button
                      size="sm"
                      variant="secondary"
                      v-on:click="Print(data.item)"
                    >
                      <i
                        class="mdi mdi-file-document-box-outline btn-icon-prepend"
                      ></i
                      >Print
                    </b-button>
                  </template>
                </b-table>

                <b-pagination
                  v-model="currentPage"
                  :per-page="perPage"
                  :total-rows="rows"
                  align="center"
                  v-on:input="pagination"
                ></b-pagination>
                <b-toast id="loadingToast" title="Processing Data" no-auto-hide>
                  <b-spinner label="Spinning" variant="success"></b-spinner>
                  <strong class="text-success">Loading...</strong>
                </b-toast>
                <b-toast id="message" title="Message">
                  <strong class="text-success">{{ message }}</strong>
                </b-toast>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vue-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="1400"
      filename="BuktiTanggungan"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="portrait"
      pdf-content-width="800px"
      @progress="onProgress($event)"
      @hasStartedGeneration="hasStartedGeneration()"
      @hasGenerated="hasGenerated($event)"
      ref="html2Pdf"
    >
      <section slot="pdf-content">
        <h2>Bukti Tanggungan</h2>
        <h6>
          -----------------------------------------------------------------
        </h6>
        <h5>Nama : {{ pdftoprint.nama }}</h5>
        <h5>Bulan : {{ pdftoprint.bulan }}</h5>
        <h5>Tahun : {{ pdftoprint.tahun }}</h5>
        <h5>
          Nominal : Rp.
          {{ Number(pdftoprint.nominal).toLocaleString() }}
        </h5>
      </section>
    </vue-html2pdf>
  </div>
</template>

<script>
import VueHtml2pdf from "vue-html2pdf";

export default {
  data: function () {
    return {
      search: "",
      id: "",
      id_petugas: "",
      id_siswa: "",
      id_spp: "",
      tanggal_pembayaran: "",
      jumlah_bayar: "",
      // action: "",
      message: "",
      currentPage: 1,
      rows: 0,
      ttlbyr: 100,
      perPage: 10,
      key: "",
      pdftoprint: [],
      fieldsSpp: ["id", "nama", "bulan", "tahun", "nominal", "Aksi"],
      nama_petugas: [],
      nis: [],
      nama_siswa: [],
      SPP: [],
      myspp: [],
      spp_arr: [],
      tahun: [],
      months: [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Augustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ],
    };
  },

  methods: {
    sppFilter(id_spp) {
      try {
        this.ttlbyr = this.spp_arr.filter((d) => d.id === id_spp)[0].nominal;
      } catch (error) {
        this.ttlbyr = 0;
      }
    },
    getDataSpp: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/sppku/" + this.perPage + "/" + offset, conf)
        .then((response) => {
          if (response.data.status == 1) {
            this.$bvToast.hide("loadingToast");
            this.myspp = response.data.spp;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data spp.";
            this.$bvToast.show("message");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    Print(item) {
      this.pdftoprint = item;
      this.generateReport();
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    getData: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      let offset = (this.currentPage - 1) * this.perPage;
      this.$bvToast.show("loadingToast");
      this.axios
        .get("/pembayaranku/" + this.perPage + "/" + offset, conf)
        .then((response) => {
          if (response.data.status == 1) {
            this.$bvToast.hide("loadingToast");
            this.pembayaran = response.data.pembayaran;
            this.rows = response.data.count;
          } else {
            this.$bvToast.hide("loadingToast");
            this.message = "Gagal menampilkan data pembayaran semua siswa.";
            this.$bvToast.show("message");
            // this.$router.push({name: "login"})
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    getPetugasDropdown: function () {
      // ambil data petugas untuk dropdown
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.axios.get("/petugas", conf).then((response) => {
        let json_user = response.data.user;
        let list_user = [];
        json_user.forEach((element) => {
          list_user.push({ value: element.id, text: element.nama_petugas });
        });
        this.nama_petugas = list_user;
      });
    },

    getSiswaDropdown: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.axios.get("/siswa", conf).then((response) => {
        let json_siswa = response.data.siswa;
        let list_siswa = [];
        json_siswa.forEach((element) => {
          list_siswa.push({ value: element.id, text: element.nama_siswa });
        });
        this.nama_siswa = list_siswa;
      });
    },

    getSppDropdown: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.axios.get("/spp/siswa/" + this.id_siswa, conf).then((response) => {
        let json_spp = response.data.spp;
        let list_spp = [];
        json_spp.forEach((element) => {
          list_spp.push({
            value: element.id,
            text:
              "#" +
              element.id +
              " - " +
              this.months[element.bulan - 1] +
              " " +
              element.tahun,
          });
        });
        this.tahun = list_spp;
        this.spp_arr = json_spp;
      });
    },

    pagination: function () {
      if (this.search == "") {
        this.getData();
      } else {
        this.searching();
      }
    },

    Add: function () {
      this.action = "insert";
      this.id = "";
      this.id_petugas = this.$store.getters.userDetail.id;
      this.id_siswa = "";
      this.id_spp = "";
      this.tanggal_pembayaran = "";
      this.jumlah_bayar = "";
      this.getPetugasDropdown();
      this.getSiswaDropdown();
      // this.getSppDropdown()
    },

    Edit: function () {
      this.id_siswa = item.id_siswa;
      this.getPetugasDropdown();
      this.getSiswaDropdown();
      this.getSppDropdown();
      this.action = "update";
      this.id = item.id;
      this.id_petugas = item.id_petugas;
      this.id_spp = item.id_spp;
      this.tanggal_pembayaran = item.tanggal_pembayaran;
      this.jumlah_bayar = item.jumlah_bayar;
    },

    Save: function () {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      this.$bvToast.show("loadingToast");

      if (this.action === "insert") {
        let form = new FormData();
        this.axios.get("/login/check", conf).then((response) => {
          if (response.data.auth == false || response.data.status == 0) {
            this.$store.commit("logout");
          }
        });

        form.append("id_petugas", this.id_petugas);
        form.append("id_siswa", this.id_siswa);
        form.append("id_spp", this.id_spp);
        form.append("tanggal_pembayaran", this.tanggal_pembayaran);
        form.append("jumlah_bayar", this.jumlah_bayar);
        this.axios
          .post("/pembayaran", form, conf)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        let form = {
          id_petugas: this.id_petugas,
          id_siswa: this.id_siswa,
          id_spp: this.id_spp,
          tanggal_pembayaran: this.tanggal_pembayaran,
          jumlah_bayar: this.jumlah_bayar,
        };
        this.axios
          .put("/pembayaran/" + this.id, form, conf)
          .then((response) => {
            this.$bvToast.hide("loadingToast");
            if (this.search == "") {
              this.getData();
            } else {
              this.searching();
            }
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },

    Drop: function (id) {
      let conf = { headers: { Authorization: "Bearer " + this.key } };
      if (confirm("Apakah anda yakin ingin menghapus data ini?")) {
        this.$bvToast.show("loadingToast");
        this.axios
          .delete("/pembayaran" + id, conf)
          .then((response) => {
            this.getData();
            this.$bvToast.hide("loadingToast");
            this.message = response.data.message;
            this.$bvToast.show("message");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },

  mounted() {
    this.key = localStorage.getItem("Authorization");
    this.getData();
    this.getDataSpp();
  },
  components: {
    VueHtml2pdf,
  },
};
</script>