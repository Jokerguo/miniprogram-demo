import request from '../../tools/request';

// 登录
export const login = (data = {}) => {
    return request<any>({ url: '/login.do', data, options: { noErrorModal: true }, needToken: false });
};

// 推广任务
export const createShortUrl = (data = {}) => {
    return request<any>({ url: '/fhd/alliance/createShortUrl.do', data });
};
