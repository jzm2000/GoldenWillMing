import { post, postJson, postForm, get } from './request.js';

//#region 用户模块
// 登录
export const login = (params) => post("/users/login",params);
// 注册
export const register = (params) => post("/users/register",params);
// 获取用户信息
export const getUserInfo = () => post("/users/info");
// 退出登录
export const logout = () => post("/users/logout");
// 修改用户信息
export const updateUserInfo = (params) => post("/users/update",params);
//#endregion 用户模块

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
// 公开日记分类
export const publicCategoryList = (params) => get("/public/publicCategoryList",params);
// 日记详情
export const getDiaryById = (params) => post("/public/detail",params);
// 新增评论
export const addComment = (params) => post("/comment/addComment",params);
// 评论列表
export const getCommentList = (params) => get("/public/commentlist",params);
//#endregion 日记模块

//#region 最新消息模块
export const getRecentNews = (params) => get("/recent-news/list",params);

//#endregion 最新消息模块
// 图片单上传
export const uploadPhoto = (params) => postForm("/upload/photo",params);
