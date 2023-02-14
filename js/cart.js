import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL("./zh_TW.json");
// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize("zh_TW"),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const url = "https://vue3-course-api.hexschool.io/v2";
const path = "azraelk";

const productModal = {
  //當id變動時 取得遠端資料 呈現Modal
  props: ["id", "addToCart", "openModal"],
  data() {
    return {
      modal: {},
      tempProduct: {},
      //預設更多加入購物車數量
      qty: 1,
      modalLoading: "",
    };
  },
  template: "#userProductModal",
  watch: {
    id() {
      // console.log("productModal:", this.id);
      if (this.id) {
        axios
          .get(`${url}/api/${path}/product/${this.id}`)
          .then((res) => {
            // console.log("單一產品", res.data.product);
            this.tempProduct = res.data.product;
            this.modal.show();
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
  },
  //關閉查看更多加入購物車後modal
  methods: {
    hide() {
      this.modal.hide();
    },
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
    //監聽DOM 當Modal關閉時 要做其他事情
    this.$refs.modal.addEventListener("hidden.bs.modal", (event) => {
      this.openModal(""); //改ID
    });
  },
};

const app = Vue.createApp({
  data() {
    return {
      products: [],
      productId: "",
      //購物車
      cart: {},
      cartStatus: false,
      isLoading: false,
      //操作完成才能在操作下一個動作
      loadingItem: "", //存id
      user: {
        name: "",
        email: "",
        tel: "",
        address: "",
      },
      message: "",
    };
  },
  methods: {
    //去得資料
    getProducts() {
      this.isLoading = true;
      axios
        .get(`${url}/api/${path}/products/all`)
        .then((res) => {
          // console.log("產品列表", res.data.products);
          this.products = res.data.products;
          this.isLoading = false;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    //點擊的時候打開Modal
    openModal(id) {
      this.productId = id;
      // console.log("外層帶入 productId:", id);
    },
    //加入購物車
    addToCart(product_id, qty = 1) {
      //qty當沒有傳入該參數時 會使用預設值
      const data = {
        product_id,
        qty,
      };
      axios
        .post(`${url}/api/${path}/cart`, { data })
        .then((res) => {
          // console.log("加入購物車", res.data);
          //關閉查看更多加入購物車後modal
          this.$refs.productModal.hide();
          this.getCarts();
          alert(res.data.message);
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    //取得購物車資料
    getCarts() {
      axios
        .get(`${url}/api/${path}/cart`)
        .then((res) => {
          // console.log("購物車", res.data);
          this.cart = res.data.data;
          if (this.cart.carts.length === 0) {
            this.cartStatus = false;
          } else {
            this.cartStatus = true;
          }
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    //購物車數量更改
    updatedCartItem(item) {
      //要帶入兩個 ID 購物車的ID 產品ID
      const data = {
        product_id: item.product.id, //產品ID
        qty: item.qty,
      };
      this.loadingItem = item.id;
      axios
        .put(`${url}/api/${path}/cart/${item.id}`, { data }) //購物車ID
        .then((res) => {
          // console.log("更新購物車", res.data);
          this.getCarts();
          alert(res.data.message);
          this.loadingItem = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    //刪除購物車資料
    delCartItem(item) {
      this.loadingItem = item.id;
      axios
        .delete(`${url}/api/${path}/cart/${item.id}`) //購物車ID
        .then((res) => {
          // console.log("刪除購物車", res.data);
          this.getCarts();
          alert(res.data.message);
          this.loadingItem = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteAll() {
      axios
        .delete(`${url}/api/${path}/carts`)
        .then((res) => {
          this.getCarts();
          alert(res.data.message);
        })
        .catch((err) => alert(err.response.data.message));
    },
    changeLoading(modalLoading) {
      this.loadingItem = modalLoading;
    },
    onSubmit() {
      const data = {
        user: this.user,
        message: this.message,
      };
      if (this.cart.carts.length === 0) {
        alert("購物車內還沒有商品唷～");
        return;
      }
      axios
        .post(`${url}/api/${path}/order`, { data })
        .then((res) => {
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
          this.message = "";
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "需要正確的電話號碼";
    },
  },
  components: {
    productModal,
  },
  mounted() {
    this.getProducts();
    this.getCarts();
  },
});
app.component("loading", VueLoading.Component);
// 元件註冊
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);
app.mount("#app");
