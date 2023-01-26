import pagination from '../pagination.js';

const url ='https://vue3-course-api.hexschool.io/v2'
const path ='azraelk'

let productModal=null;
let delProductModal=null;

const app= Vue.createApp({
  //資料
  data(){
    return{
      //產品資料
      products:[],
      tempProduct:{
        imagesUrl: [],
      },
      isNew:true, //確認是編輯或新增所使用
      page:{}//儲存分頁資料
    }
  },
  //方法(事件觸發)

methods: {
  //檢查登入
  checkAdmin(){
    axios.post(`${url}/api/user/check`)
    .then(res => {
      this.getData();
    })
    .catch(err => {
      alert('登入失敗請重新登入')
      window.location='login.html'
      //登入失敗返回登入畫面
    })
  },
  //取得產品資料
  getData(page=1){//預設參數
    axios.get(`${url}/api/${path}/admin/products/?page=${page}`)
    .then((res) => {
      this.products= res.data.products;
      this.page=res.data.pagination
    })
    .catch((err) => {
      alert(err.data.message)
    })
  },
  //更新產品資料
  updateProduct(){ 
    let apiUrl =`${url}/api/${path}/admin/product`
    let apiMethod ='post'
    //用isNew判斷
    //如果isNew是新增的情況跑上面兩行
    //如果isNew不是就跑下面兩行
    if (!this.isNew) {
      apiMethod = `put`;
      apiUrl = `${url}/api/${path}/admin/product/${this.tempProduct.id}`;
  }
  //新增產品
  //axios.post換成上方變數
  axios[apiMethod](apiUrl, {data: this.tempProduct,})
    .then((res) => {
      alert(res.data.message);
      this.getData();//重新取得列表
      productModal.hide();//新增完關閉產品式窗 
    })
    .catch((error) => {
      alert(error.data.message);
    });
  },
  //刪除產品
  delProduct(){
    axios.delete(`${url}/api/${path}/admin/product/${this.tempProduct.id}`)
    .then(res => {
      alert(res.data.message);
      delProductModal.hide();
      this.getData();
    })
    .catch(err => {
      alert(err.data.message)
    })
  },
  //開啟modal
 openModal(parameter,product){
  //新增產品
  if( parameter ==='new'){
    this.tempProduct={
      imagesUrl:[],
    }
    this.isNew=true;
    //帶入初始化資料
    productModal.show();
  }
  //編輯產品頁面
  else if (parameter ==='update'){
    this.tempProduct={...product};//取得編輯產品內容
    this.isNew=false;
    //帶入當前要編輯資料
    productModal.show();
  }
  //刪除產品
  else if(parameter ==='delete'){
    this.tempProduct={...product};//取得刪除產品內容
    delProductModal.show();//呼叫方法
  }
 },
 createImages(type){
  if(type="init"){
    this.tempProduct.imagesUrl=[];
  }
  this.tempProduct.imagesUrl.push('')//多圖區
},
},
components:{
  pagination
},
mounted() {
   // 取出 Token
   const token = document.cookie.replace(/(?:(?:^|.*;\s*)azraelkToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
   axios.defaults.headers.common.Authorization = token;
   // 每次發出request時都帶入token驗證身份
   this.checkAdmin();
   //建立 Bootstrap modal 初始化
   productModal = new bootstrap.Modal(document.querySelector("#productModal"));
   delProductModal = new bootstrap.Modal(document.querySelector("#delProductModal"));
},
})
//modal元件
app.component('product-modal',{
  props:['tempProduct','updateProduct'],
  template: '#product-modal-template',
})
  
app.mount('#app')