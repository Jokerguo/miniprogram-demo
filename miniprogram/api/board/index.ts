import request from '../../tools/request';

//一级联盟的数据看板
//一级自己看自己 顶部
export const getOneMemberData = (data = {}) => {
    return request<IBoardData>({ url: '/fhd/member/promote/member', data, method: 'GET' });
};
//一级看二级 顶部
export const getOneCustomerData = (data = {}) => {
    return request<IBoardData>({ url: '/fhd/member/promote/customer', data, method: 'GET' });
};

//二级查看自己的客户信息 顶部
export const getTwoMemberData = (data = {}) => {
    return request<IBoardData>({ url: '/fhd/member/promote/customer/secondary', data, method: 'GET' });
};

//列表
//一级查看二级联盟数据明细（单数和收入）  一级自己看自己
export const getSecondaryAllianceDataDetails = (data = {}) => {
    return request<ListResponse<IOneLookSelf>>({ url: '/wx/account/getSecondaryAllianceDataDetails', data, method: 'GET' });
};

//一级看二级
export const getPromoteUserOrderInfo = (data = {}) => {
    return request<ListResponse<IOneLookTwo>>({ url: '/wx/promoteUser/getPromoteUserOrderInfo', data, method: 'GET' });
};

//二级查看自己的客户信息
export const getPromoteUserInfo = (data = {}) => {
    return request<ListResponse<IOneLookSelf>>({ url: '/wx/promoteUser/getPromoteUserInfo', data, method: 'GET' });
};
