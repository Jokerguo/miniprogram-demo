interface InfoRes {
  groupId: string;
  groupName: string;
  level: 1 | 2;
  name: string;
}

interface PromoteRes {
  inCome: string;
  incomeGrow: string;
  newUserCount: number;
  newUserCountGrow: string;
  orderCount: number;
  orderCountGrow: string;
}

interface IncomeRes {
  allIncome: string;
  balance: string;
  incomeGrow: string;
  memberCount: number;
  todayIncome: string;
  todayOrderCount: number;
  userCount: number;
}