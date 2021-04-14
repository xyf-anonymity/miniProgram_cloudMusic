//发送请求的方法
import { BASEURL } from './config.js'
export default function (url = "", data = {}, method = "GET", header = {}) {
    // console.log(data)
    let cookie = wx.getStorageSync('cookies').toString()
    let token = wx.getStorageSync('token')
    return new Promise((resolve, reject) => {
        wx.request({
            url:BASEURL + url,
            data,
            method,
            header:{cookie,Authorization:token},
            success(res) {
                if (data.needCookie) {
                    wx.setStorageSync('cookies',res.cookies) 
                }
                resolve(res.data)
            },
            fail (error) {
                reject(error)
            }
        })
    })
}