import request from '../../tools/request';

// 首页联盟信息
export const baseInfoDto = (data = {}) => {
    return request<InfoRes>({ url: '/fhd/member/startPage/baseInfoDto', data, method: 'GET' });
};

// 首页联盟收入数据
export const income = (data = {}) => {
    return request<IncomeRes>({ url: '/fhd/member/startPage/income', data, method: 'GET' });
};

// 首页联盟推广数据
export const promote = (data = {}) => {
    return request<PromoteRes>({ url: '/fhd/member/startPage/promote', data, method: 'GET' });
};
