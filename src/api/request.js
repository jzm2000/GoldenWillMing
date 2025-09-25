import axios from "axios";
import { useUserStore } from "@/store/user.js";
let userStore = null;
const instance = axios.create({
    baseURL: location.protocol + import.meta.env.VITE_API_URL,
    timeout: 10000,
});

function handle(method = 'get',url,params,responseType='json',headers = {}){
    return new Promise((resolve,reject)=>{
        instance({
            method:method,
            url:url,
            ...(method === 'get' ? { params:params } : { data:params }),
            responseType:responseType,
            headers
        }).then(res=>{
            resolve(res.data)
        }).catch(err=>{
            reject(err)
        })
    })
}
// 普通POST请求
export const post = (url,params) => handle('post',url,params);
// JSON请求
export const postJson = (url,params) => handle('post',url,params,{ "Content-Type": "application/json" });
// 表单请求
export const postForm = (url,params) => handle('post',url,params,{ 'Content-Type':'multipart/form-data' });

// GET请求
export const get = (url,params) => handle('get',url,params);

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    userStore = useUserStore();
    if(userStore.token){
        config.headers.Authorization = 'Bearer ' +  userStore.token;
    };
    return config;
  }, function (error) {

    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {

    console.log(response);
    return response;
}, function (error) {
    
    return Promise.reject(error);
});