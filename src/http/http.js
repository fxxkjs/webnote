import axios from 'axios';
export const api = "https://webnote.fun"
//export const api = "http://127.0.0.1:65535"

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
export async function register(username, password) {
    return await axios.post(`${api}/register`, { username, password })
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