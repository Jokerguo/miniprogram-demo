//一级联盟
interface IOneAccountAmountInfo {
    canCarryPrice: string; //可提现金额
    totalPrice: number | string; //累计金额
}
//获取联盟结算账户
interface IAllianceSettleAccount {
    alipayAccount: string;
    bankDeposit: string;
    bankcard: string;//银行卡
    code: string;
    createTime: number;
    extractAmount: number;
    identityCard: string;//身份证
    operName: string;
    operPhone: string;
    status: string; //可用值:CLOSE,DISCARD,OPEN
    totalAmount: number;
    widthDrawMoney: string;
}

//一二级联盟收入明细
interface MoneyInfoItem {
    incomeAmount: string;
    incomeContent: string;
    incomeTime: number;
}

//收入明细的列表
type IncomeInfo = ListResponse<MoneyInfoItem>;
