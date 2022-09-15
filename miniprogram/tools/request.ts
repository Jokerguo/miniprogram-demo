import { Modal, Toast } from './wx';

const app = getApp<IAppOption>();
// develop 开发版 trial 体验版 release 正式版
const env = wx.getAccountInfoSync().miniProgram.envVersion;
// baseUrl集合
const baseUrlMap: {
    [key: string]: string;
} = {
    base: 'https://wxapi.fhd001.com',
    msapl: 'https://wxapi.fhd001.com/msapl',
};
//请求白名单
const whiteRequestList = ['/test'];

const request = ({ url, method, data, header = {}, options = {}, needToken = true }: RequestConfig) => {
    return new Promise((resolve, reject) => {
        const baseUrl = baseUrlMap[options.baseUrl || 'base'];
        const { token } = app.globalData;
        if (!token && needToken) {
            // '重新登录'
            return;
        }
        // 取消请求
        if (app.globalData.requestTask && whiteRequestList.indexOf(url) === -1) {
            try {
                app.globalData.requestTask[baseUrl + url].abort();
                app.globalData.requestTask = null;
            } catch (e) {
                console.error('取消请求失败', e);
            }
        }
        if (token) {
            header.token = token;
        }
        if (env === 'develop' && [''].indexOf(url) !== -1) {
            header.tag = 'zzc';
        }
        let requestTask = wx.request({
            url: baseUrl + url,
            method: method || 'POST',
            data,
            header: {
                'content-type': 'application/json',
                ...header,
            },
            success: (res: Response) => {
                if (res.statusCode === 200) {
                    if (res.data.rcode === 0 && res.data.scode === 0) {
                        return resolve(res.data.data);
                    }
                    // token失效
                    if (res.data.scode == 103) {
                        return Modal.confirm({
                            content: '登录凭证过期，请重新登录',
                            success: (res) => {
                                if (res.confirm) {
                                    wx.reLaunch({ url: '/pages/login/login' });
                                }
                            },
                        });
                    }
                    const content = (res.data.errorMsg || res.data.data || '未知错误') + ' ' + (res.data.traceId || '');
                    Modal.confirm({
                        content,
                        showCancel: false,
                        success: () => {
                            env !== 'release' && wx.setClipboardData({ data: content });
                        },
                    });
                } else {
                    const title = res.statusCode == 404 ? '接口不存在 404!' : '网络超时';
                    Toast.alert({ title });
                }
            },
            fail: (res) => {
                reject(res.errMsg || 'wx request error');
            },
        });
        requestTask = requestTask || { errMsg: 'requestTask is undefined' };
        app.globalData.requestTask = { [baseUrl + url]: requestTask };
    });
};

export default request;
