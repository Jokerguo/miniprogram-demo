import { getBaseUrl, cancelRequest, againLogin, handleError } from './requestConfig';
import {globalData} from './global';
import { Toast } from './wx';

const request = <T>({ url, method, data = {}, header = {}, options = {}, needToken = true }: RequestConfig): Promise<T> => {
    return new Promise((resolve, reject) => {
        const token = wx.getStorageSync('token');
        if (!token && needToken) {
            return againLogin();
        }
        if (token) {
            data.token = token;
        }
        wx.request({
            url: url,
            method: method || 'POST',
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                ...header,
            },
            success: (res: Response<T>) => {
                if (res.statusCode === 200) {
                    if (res.data.rcode === 0 && res.data.scode === 0) {
                        return resolve(res.data.data);
                    } else {
                        // token失效
                        if (res.data.scode === 103 || res.data.scode === 6) {
                            againLogin()
                            return reject(res.data);
                        }
                        // 全局报错
                        if (!options.noErrorModal) {
                            handleError(res);
                        }
                        reject(res.data);
                    }
                } else {
                    wx.showToast({
                        title: res.statusCode === 404 ? '接口不存在 404!' : '网络超时',
                        icon: 'none',
                        mask: true,
                    });
                    reject(res.data);
                }
            },
            fail: (res) => {
                reject(res.errMsg || 'wx request error');
            },
        });
    });
};

export default request;
