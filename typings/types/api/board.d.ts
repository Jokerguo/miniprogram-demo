interface IBoardData {
    billingMemberCount: number; //开单二级联盟数
    billingMemberCountGrow: string; //开单二级联盟数较之前
    billingUserCount: number; //开单二级用户数
    billingUserCountGrow: string; //开单二级用户数较之前
    income: number; //收入：邀请+推广
    incomeGrow: string; //收入较之前：邀请+推广
    orderCount: number; //推广订单数
    orderCountGrow: string; //推广订单数较之前
    promoteIncome: number; //推广收入
    promoteIncomeGrow: string; //推广收入较之前
}

//二级联盟数据 一级自己看自己
interface IOneLookSelf {
    allianceName: string; //名称
    groupName: string; //分组
    invitationOrders: string; //推广订单数
    promotionIncome: string; //邀请收入
    promotionOrders: string; //邀请订单数
    showNick: boolean; //是是否显示全部昵称
}

//一级看二级
interface IOneLookTwo {
    avatar: string; //头像
    nick: string; //备注
    promoteIncome: string; //推广收入
    promoteOrderNum: string; //推广订单数
    showNick: boolean; //是是否显示全部昵称
}
