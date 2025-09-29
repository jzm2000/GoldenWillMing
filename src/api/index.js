import { post, postJson, postForm, get } from './request.js';

//#region 用户模块
// 登录
export const login = (params) => post("/users/login",params);
// 获取用户信息
export const getUserInfo = () => post("/users/info");

//#endregion 用户模块

// 日记模块
//#region日记模块
// 日记新增
export const addDiary = (params) => post("/diary/add",params);
// 日记修改
export const updateDiary = (params) => post("/diary/update",params);
// 日记列表
export const getDiaryList = (params) => get("/diary/list",params);
// 公开日记列表
export const getPublicDiaryList = (params) => get("/public/diary/list",params);
// 点赞日记
export const likeDiary = (params) => post("/diary/like",params);
// 日记分类
export const categoryList = (params) => get("/diary-category/categoryList",params);

//#endregion 日记模块