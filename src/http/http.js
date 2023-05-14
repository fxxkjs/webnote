import axios from 'axios';
axios.defaults.withCredentials = true

export const api = process.env.VUE_APP_API
// 获取顶部导航(一级目录)
export async function getTopNav() {
    return await axios.get(`${api}/topnav`)
}
// 获取左侧导航(二级目录)
export async function getLeftNav(param) {
    return await axios.get(`${api}/leftNav?topnav=${param}`)
}
// 获取文档数据
export async function getContent(t, l, c) {
    return await axios.get(`${api}/cont/${t}/${l}/${c}`)
}

// 注册
export async function register(username, password, code) {
    return await axios.post(`${api}/register`, { username, password, code })
}
// 验证
export async function getCookieType() {
    return await axios.post(`${api}/cookieType`)
}
// 新建分类
export async function addFolder(topNav, leftNav = null) {
    return await axios.post(`${api}/addFolder`, { topNav, leftNav })
}
// 删除分类
export async function delFolder(topNav, leftNav = null, items = null) {
    return await axios.post(`${api}/delFolder`, { topNav, leftNav, items })
}

// 更新md
export async function upMdData(topNavType, leftNavType, ItemType, content) {
    return await axios.post(`${api}/upMdData`, { topNavType, leftNavType, ItemType, content })
}

// 上传图片
export async function upImg(imgdata) {
    return await axios.post(`${api}/upImg`, { imgdata }, { headers: { 'Content-Type': 'multipart/form-data' } })
}

// 删除图片
export async function delImg(imgName) {
    return await axios.post(`${api}/delImg`, { imgName })
}

// 查询图片是否上传过
export async function queryImg(imgNameArr) {
    return await axios.post(`${api}/queryImg`, { imgNameArr })
}

// 新建文件
export async function addMd(topNavType, leftNavType, mdName) {
    return await axios.post(`${api}/addMd`, { topNavType, leftNavType, mdName })
}

// 重命名
export async function setMdName(topNavType, leftNavType, mdName, newMdName) {
    return await axios.post(`${api}/setMdName`, { topNavType, leftNavType, mdName, newMdName })
}

// 获取验证码
export async function getCode(username) {
    return await axios.post(`${api}/getCode`, { username })
}

// 设置session
export async function setSession() {
    return await axios.get(`${api}/session`)
}