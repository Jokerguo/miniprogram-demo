import request from '../tools/request';
//获取联盟成员和账户信息
export const getMemberAccountInfo = (data = {}) => {
    return request<IMemberAccountInfo>({ url: '/wx/account/getMemberAccountInfo', method: 'GET' });
};
