import { Toast } from '@Tool/wx';
import { baseInfoDto, income, promote } from '@Api/home/index';
import { taskQrcodeList } from '@/config/index';
import { globalData, App } from '@Tool/global';
import { getStartEndTime, throttle } from '@Tool/util';

type Type = 0 | 1 | 2;

Page({
    data: {
        userInfo: {}, //用户信息
        //收入信息
        incomeInfo: {
            allIncome: '0.00',
            balance: '0.00',
            incomeGrow: '--',
            memberCount: 0,
            todayIncome: '0.00',
            todayOrderCount: 0,
            userCount: 0,
        },
        //推广信息
        promoteInfo: {
            inCome: '0.00',
            incomeGrow: '--',
            newUserCount: 0,
            newUserCountGrow: '--',
            orderCount: 0,
            orderCountGrow: '--',
        },
        showName: false, // 折叠昵称
        isSelecting: false, // 选择中
        currentType: 0 as Type,
        types: {
            0: '今日',
            1: '本月',
            2: '累计',
        },
        dataList: [
            {
                title: '推广客户数',
                countKey: 'newUserCount',
                diffKey: 'newUserCountGrow',
            },
            {
                title: '推广订单数',
                countKey: 'orderCount',
                diffKey: 'orderCountGrow',
            },
            {
                title: '推广收入/元',
                countKey: 'inCome',
                diffKey: 'incomeGrow',
            },
        ],
        // 推广列表
        taskQrcodeList: taskQrcodeList,
        loading: true,
    },
    async onLoad() {
        wx.hideShareMenu();
        try {
            // 检查登录
            await App.checkLogin();
            this.setData({ userInfo: globalData.userInfo });
            await this.getUserInfo();
            await this.getIncomeInfo();
            await this.getPromoteInfo();
        } catch (error) {
        } finally {
            this.setData({ loading: false });
        }
    },
    // 用户信息
    async getUserInfo() {
        const data = await baseInfoDto();
        this.setData({ userInfo: { ...globalData.userInfo, ...data } });
    },
    // 收入信息
    async getIncomeInfo() {
        const incomeInfo = await income(getStartEndTime(0));
        this.setData({ incomeInfo });
    },
    // 数据信息
    async getPromoteInfo() {
        const promoteInfo = await promote({
            type: this.data.currentType,
            ...getStartEndTime(this.data.currentType),
        });
        this.setData({ promoteInfo });
    },
    // 选择类型
    selectType() {
        this.setData({ isSelecting: true });
        wx.showActionSheet({
            itemList: Object.values(this.data.types),
            success: (e) => {
                this.setData({ currentType: e.tapIndex as Type });
                this.getPromoteInfo();
            },
            complete: () => {
                this.setData({ isSelecting: false });
            },
        });
    },
    // 跳转
    handleLink(e: WechatMiniprogram.BaseEvent) {
        const { startTime, endTime } = getStartEndTime(this.data.currentType);
        const { index } = e.currentTarget.dataset;
        if(index === 0 && globalData.level === 1){
            Toast.alert({title: '暂未开放'})
            return
        }
        const url =
            index === 0
                ? `/sub-user-info/pages/client-info/client-info?startTime=${startTime}&endTime=${endTime}`
                : `/sub-money-info/pages/order-history/order-history?type=${this.data.currentType}&startTime=${startTime}&endTime=${endTime}`;
        this.onLink(url);
    },
    linkTo(e: WechatMiniprogram.BaseEvent) {
        this.onLink(e.currentTarget.dataset.url);
    },
    onLink: throttle(async function (url: string) {
        wx.navigateTo({ url });
    }),
    toggleShowName() {
        this.setData({ showName: !this.data.showName });
    },
    viewImg(e: WechatMiniprogram.BaseEvent) {
        wx.previewImage({
            urls: [e.target.dataset.link],
            showmenu: true,
        });
    },
    // 下拉刷新
    async onPullDownRefresh() {
        this.getUserInfo();
        this.getIncomeInfo();
        this.getPromoteInfo();
        wx.stopPullDownRefresh();
    },
    onShareAppMessage(e) {
        const { index } = e.target.dataset;
        return {
            title: '补充快递邀请码',
            imageUrl: taskQrcodeList[index].link,
            path: `/sub-share/pages/qrcodeInvite/qrcodeInvite?index=` + index,
        };
    },
});
