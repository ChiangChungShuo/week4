import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
const url ='https://vue3-course-api.hexschool.io/v2'
const path ='azraelk'
createApp({
  //資料
  data() {
    return {
      products: [],
      //產品資料
      tempProduct: {},
      // 定義一個物件儲存單一產品資料
    }
  },
  // 方法(事件觸發)
  methods: {
    //檢查登入
    checkAdmin() {
      axios.post(`${url}/api/user/check`)
        .then(() => {
          this.getData(); //觸發29行
        })
        .catch((err) => {
          alert(err.response.data.message)
          window.location = 'login.html';
          //失敗回登入畫面
        })
    },
    //取得產品資料
    getData() {
      axios.get(`${url}/api/${path}/admin/products`)
        .then((res) => {
         this.products=res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openProduct(item) {
      this.tempProduct = item;
    }
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)azraelkToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    // 每次發出request時都帶入token驗證身份
    this.checkAdmin();
  }
}).mount('#app');