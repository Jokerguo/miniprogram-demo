import request from '../../tools/request';

//获取联盟提现列表
export const getWithdrawInfo = (data = {}) => {
    return request<TWithdrawList>({ url: '/wx/settleAccount/getWithdrawInfo', data, method: 'GET' });
};
//按月和提现状态查询总提现金额
export const getWithdrawAmountByMonth = (data = {}) => {
    return request<{ withdrawAmount: number }>({ url: '/wx/settleAccount/getWithdrawAmountByMonth', data, method: 'GET' });
};

//查询提现记录tab栏
export const getWithdrawalRecords = (data = {}) => {
    return request<WithdrawTab>({ url: '/wx/settleAccount/getWithdrawalRecords', data, method: 'GET' });
};
