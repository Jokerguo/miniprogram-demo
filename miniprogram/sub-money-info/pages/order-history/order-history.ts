import { getOneCustomerData, getPromoteUserOrderInfo, getSecondaryAllianceDataDetails, getTwoMemberData } from '../../../api/board/index';
import { getOneMemberData } from '../../../api/board/index';
import { globalData } from '../../../tools/global';
import { getStartEndTime } from '../../../tools/util';
import dayjs from 'dayjs';

type Params = {
    startTime: number;
    endTime: number;
    page: number;
    pageSize: number;
    secondaryCode?: number | string;
};

const initData = {
    billingMemberCount: 0, //开单二级联盟数
    billingMemberCountGrow: '', //开单二级联盟数较之前
    billingUserCount: 0, //开单二级用户数
    billingUserCountGrow: '', //开单二级用户数较之前
    income: 0, //收入：邀请+推广
    incomeGrow: '', //收入较之前：邀请+推广
    orderCount: 0, //推广订单数
    orderCountGrow: '', //推广订单数较之前
    promoteIncome: 0, //推广收入
    promoteIncomeGrow: '', //推广收入较之前
};

function getGrowText(grow: number) {
    if (grow === 1) return '较昨日';
    if (grow === -1) return '较上月';
    if (grow === -2) return '';
    if (grow === -3) return '较前一个月';
    if (typeof grow === 'number') {
        return '较前' + grow + '日';
    }
    return '';
}

//看选择的是不是一整个月
/**
 * @description:
 * @param {number} currentOptions 当前tab
 * @param {number} start
 * @param {number} end
 * @return {*} 1较昨日 -1 教上月  -2 累计  -3 前一个月 2-30日 前...日
 */
function getStartAndEnd(currentOptions: number, start: number, end: number) {
    if (currentOptions === 0) return 1;
    if (currentOptions === 1) return -1;
    if (currentOptions === 2) return -2;
    const date1 = dayjs(start * 1000);
    const date2 = dayjs(end * 1000);
    const dayCount = dayjs(start * 1000).daysInMonth(); // 31
    const gap = date2.diff(date1); // 20214000000 默认单位是毫秒
    const day = Math.ceil(gap / 1000 / 60 / 60 / 24);
    if (day === dayCount) return -3;
    return day;
}

const defaultParams = { page: 1, pageSize: 10, total: 0 };
Page({
    data: {
        isOpen: false,
        options: [
            { text: '今日', val: 0 },
            { text: '本月', val: 1 },
            { text: '累计', val: 2 },
        ],
        currentOptions: 0,
        time: {
            startTime: 0,
            endTime: 0,
        },
        level: 0,
        //数据
        boardData: initData,
        params: defaultParams,
        status: {
            isLoading: false,
            topLoading: false,
            isEmpty: false,
            isEnd: false,
            isError: false,
        },
        list: [],
        //一级联盟查看二级联盟订单记录 携带的code
        code: '',
        growText: '较昨日', //较昨日
    } as {
        isOpen: boolean;
        options: { text: string; val: number }[];
        currentOptions: number;
        time: { startTime: number; endTime: number };
        boardData: IBoardData;
        level: number;
        params: IPageParams;
        status: {
            isLoading: boolean;
            topLoading: boolean;
            isEnd: boolean;
            isError: boolean;
            isEmpty: boolean;
        };
        list: (IOneLookSelf | IOneLookTwo)[];
        code: string;
        growText: string;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options: any) {
        // type=3&startTime=1667232000&endTime=1669823999
        if (options.code) { this.setData({ code: options.code }); }
        const level = globalData.level;
        this.setData({ level });
        this.setBarTitle();

        //一级联盟叫订单记录 二级联盟叫客户信息
        const type: any = +options.type || 0;
        if (type === 3) {
            this.setData({
                currentOptions: 3,
                time: {
                    startTime: options.startTime,
                    endTime: options.endTime,
                },
            });
        } else {
            this.setData({ time: getStartEndTime(type || 0), currentOptions: type });
        }
        this.initData();
    },
    setBarTitle() {
        const { level, code } = this.data;
        wx.setNavigationBarTitle({ title: level === 1 ? (!code ? '二级联盟数据' : '订单记录') : '客户数据' });
    },
    initData(pulldown = false) {
        Promise.all([this.getBoardData(), this.getList(true, pulldown)]).then((res) => {
            if (res[0] && res[1]) {
                this.overStatus();
            } else {
                this.setData({
                    list: [],
                    ['status.isLoading']: false,
                    ['status.topLoading']: false,
                });
            }
        });
    },
    async getBoardData() {
        //一级查看二级
        const { level, time, currentOptions, code } = this.data;
        let boardData: any = null;
        let flag = true;

        try {
            //一级联盟
            if (level === 1 && !code) {
                boardData = await getOneMemberData({ ...time, type: currentOptions });
            } else if (level === 1) {
                //一级查看二级联盟订单记录
                boardData = await getOneCustomerData({ ...time, type: currentOptions, code });
                //一级查看二级联盟订单记录
            } else {
                //二级联盟自己
                boardData = await getTwoMemberData({ ...time, type: currentOptions });
            }
        } catch (error) {
            const str = JSON.stringify(error);
            if (~str.indexOf('request:fail abort')) {
                return flag;
            }
            boardData = initData;
            flag = false;
        }
        const growText = getGrowText(getStartAndEnd(currentOptions, time.startTime, time.endTime));

        this.setData({ boardData, growText });
        return flag;
    },
    getParams(refresh = false) {
        let {
            params: { page, pageSize },
            time,
            code,
        } = this.data;
        if (refresh) {
            page = 1;
        }
        const obj: Params = { page, pageSize, ...time };
        if (code) obj.secondaryCode = code;
        return obj;
    },
    resetParams() {
        this.setData({ params: { ...defaultParams } });
    },
    /**
     * @description:
     * @param {*} refresh 是否刷新
     * @return {*}
     */
    //下拉不删除列表
    async getList(refresh = false, pulldown = false) {
        if (this.data.status.isLoading && !refresh) return;
        if (refresh) {
            this.resetParams();
            if (!pulldown) {
                this.setData({ list: [] });
            }
        }
        const { level, code } = this.data;
        try {
            const params = this.getParams(refresh);
            type listRes = ListResponse<IOneLookSelf | IOneLookTwo>;
            let res: listRes;
            if (level === 1 && !code) {
                res = await getSecondaryAllianceDataDetails(params);
            } else if (level === 1) {
                res = await getPromoteUserOrderInfo(params);
            } else {
                //二级看自己
                res = await getPromoteUserOrderInfo(params);
            }
            res.list = res.list.map((item) => ({ ...item, showNick: false }));
            const list = refresh ? res.list : this.data.list.concat(res.list);
            this.setData({ list });
            this.afterSearch(res.page, res.pages, res.total);
        } catch (error) {
            this.setData({
                list: [],
                ['status.isLoading']: false,
                ['status.isError']: true,
            });
            return false;
        }
        return true;
    },
    //打开时间选择器
    handleCustomTime() {
        this.selectComponent('#calendar').open();
    },
    handleSwitch({ mark }: WechatMiniprogram.BaseEvent) {
        this.setData({ currentOptions: mark?.val });
        this.setData({
            time: getStartEndTime(mark?.val),
        });
        this.selectComponent('#calendar').clearData();
        this.switchTabReq();
    },
    /**
     * 点击日期时候触发的事件
     */
    getdate(e: any) {
        if (!e.detail.startTime) return;

        this.setData({
            currentOptions: 3,
            time: e.detail,
        });
        this.switchTabReq();
    },
    //切换了顶部的tab
    switchTabReq() {
        this.handleRefresh(false);
    },
    //下拉刷新
    handleRefresh(showFresh = true, pulldown = true) {
        if (showFresh) {
            this.refreshStatus();
        } else {
            this.loadingStatus();
        }
        this.initData(pulldown);
    },

    loadMore() {
        if (this.data.status.isLoading) return;
        this.setData(
            {
                ['status.loading']: true,
            },
            () => {
                setTimeout(() => {
                    this.setData({
                        ['status.loading']: false,
                        ['status.end']: true,
                    });
                }, 10000);
            },
        );
    },
    updateStatus(isLoading = false, topLoading = false, isEnd = false, isError = false) {
        this.setData({ status: { ...this.data.status, isLoading, topLoading, isEnd, isError } });
    },
    errorStatus() {
        this.updateStatus(false, false, false, true);
    },
    // 底部loading展示
    loadingStatus() {
        this.updateStatus(true, false, false, false);
    },
    /* 头部展示loading */
    refreshStatus() {
        this.updateStatus(false, true, false, false);
    },
    /* 结束所有标识 */
    overStatus() {
        const { status } = this.data;
        this.updateStatus(false, false, status.isEnd, false);
    },
    afterSearch(page: number, pages: number, total: number) {
        if (typeof page === 'undefined' || typeof pages === 'undefined' || typeof total === 'undefined') {
            return;
        }
        const status = { ...this.data.status, isLoading: false };
        if (this.data.params.page != page) {
            this.setData({ ['params.page']: page });
        }
        if (this.data.params.total != total) {
            this.setData({ ['params.total']: total });
        }
        if (page >= pages && total !== 0) {
            status.isEnd = true;
        } else {
            status.isEnd = false;
        }
        if (total == 0 && page == 1) {
            status.isEmpty = true;
        } else {
            status.isEmpty = false;
        }
        this.setData({ 'params.page': this.data.params.page + 1 });
        this.setData({ status });
    },

    /* 事件处理 */
    showNick({ mark }: any) {
        const { item, i } = mark;
        if (!item) return;
        const { list } = this.data;
        list[i] = { ...list[i], showNick: !list[i]['showNick'] };
        this.setData({ list });
    },
});
