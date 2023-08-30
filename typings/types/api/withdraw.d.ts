// 提现记录
interface IWithdrawItem {
    billingStatus: number;
    content: string;
    withdrawAccount: string;
    withdrawAmount: string;
    withdrawStatus: number;
    withdrawTime: number;
}

//提现记录列表
type TWithdrawList = ListResponse<IWithdrawItem>;

//提现记录页的tab栏
type WithdrawTab = {
    allSettlementNum: number;
    settledNum: number;
    unSettlementNum: number;
};
