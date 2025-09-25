import { post, postJson, postForm, get } from './request.js';
// 登录
export const login = (params) => post("/users/login",params);
// 获取用户信息
export const getUserInfo = () => post("/users/info");