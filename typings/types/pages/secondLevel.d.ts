interface Member {
    code: string;
    groupId: number;
    groupName: string;
    name: string;
    status: 0 | 1; //0:开启 1：关闭
    showName: boolean; // 是否显示全部姓名
}

interface MemberList {
    groupId: number;
    amount: number;
    list: Member[];
}

interface MemberInfo {
    cellphone: string;
    code: string;
    groupName: string;
    name: string;
}

interface MemberPromoteInfo {
    promotionCustomersNum: number;
    promotionIncome: string;
    promotionOrder: number;
}
