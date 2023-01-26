import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

//api
const apiUrl = `https://vue3-course-api.hexschool.io/v2`;

//建立Vue元件

createApp({
   // 資料
    data() {
      return {
        user: {
          username: '',
          password: '',
        },
      }
    },
    //方法
    methods:{
        login(){
            axios.post(`${apiUrl}/admin/signin`, this.user)
            .then(res => {
                const { token, expired } = res.data;
                // 儲存cookie
                // expires是設置有效時間
                document.cookie = `azraelkToken=${token};expires=${new Date(expired)};`; //儲存token              
                window.location = 'product.html';
                // 轉跳後台。
            })
            .catch(err => {
                alert(err.data.massage); 
            })
        }
    }
}).mount('#app')