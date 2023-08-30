/// <reference path="./types/index.d.ts" />

interface UserInfo{
    authCode: string;
    canWithDrawMoney: boolean;
    cellphone: string;
    code: string;
    fhdExpress: boolean;
    parentCellphone: string;
    parentCode: string;
    showFhdUrl: boolean;
    showFhdqUrl: boolean;
    showFthOnTrial: boolean;
    showFthPermanent: boolean;
    showFthUrl: boolean;
    showGiveUrl: boolean;
    showOrderUrl: boolean;
    showWxUrl: boolean;
    token: string
}

interface IAppOption {
    globalData: {
        env: 'develop' | 'trial' | 'release',
        version: string,
        userInfo: Partial<UserInfo>;
        // 1：一级 2：二级
        level: 1 | 2,
        requestTasks: {
            [key: string]: WechatMiniprogram.RequestTask;
        };
        // 时差
        timeDiff: number
    };
    /**
     * 初始化用户信息
     */
    initUser: ()=> void;
    /**
     * 检测登录
     * @param {Boolean} free - 是否免登
     */
    checkLogin: (free?: boolean)=> Promise<Boolean>;
    setUserInfo: (e: UserInfo)=> void;
    setToken: (e: string)=> void;
}
