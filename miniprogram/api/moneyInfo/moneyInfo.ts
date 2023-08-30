import request from '../../tools/request';
//获取联盟成员和账户信息
export const getOneAccountAmountInfo = () => {
    return request<IOneAccountAmountInfo>({ url: '/wx/settleAccount/getOneAccountAmountInfo', method: 'GET' });
};

// 二级查看余额
export const getTwoAccountAmountInfo = () => {
    return request<IOneAccountAmountInfo>({ url: '/wx/settleAccount/getTwoAccountAmountInfo', method: 'GET' });
};

//一级 联盟提现
export const withdrawMoneyV2 = (data = {}) => {
    return request<boolean>({ url: '/fhd/alliance/withdrawMoneyV2', data });
};

//获取联盟结算账户
export const getAllianceSettleAccount = (data = {}) => {
    return request<IAllianceSettleAccount>({ url: '/fhd/alliance/getAllianceSettleAccount', method: 'POST' });
};

//一二级联盟收入明细
export const getIncomeInfo = (data = {}) => {
    return request<IncomeInfo>({ url: '/wx/settleAccount/getIncomeInfo', data, method: 'GET' });
};

//根据月份查收入金额
export const getIncomeAmountByMonth = (data = {}) => {
    return request<{ amount: number }>({ url: '/wx/settleAccount/getIncomeAmountByMonth', data, method: 'GET' });
};
