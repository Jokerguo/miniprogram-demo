import { getWithdrawalRecords, getWithdrawAmountByMonth, getWithdrawInfo } from './../../../api/withdraw/index';
import dayjs from 'dayjs';
import { getMonthStartAndEndTime, getNowTime, getStartEndTime } from '../../../tools/util';
import { globalData } from '../../../tools/global';

type status = boolean | null;
const defaultParams = { page: 1, pageSize: 20, total: 0 };
Page({
    data: {
        confirmModal: false,
        titleArr: [
            { text: '全部', key: 0, value: 0 },
            { text: '已结算', key: 1, value: 0 },
            { text: '未结算', key: 2, value: 0 },
        ],
        currentTab: 0,
        loadStatus: {
            isLoading: false,
            isEnd: false,
            isError: false,
            isEmpty: false,
        },
        params: defaultParams,
        refreshStatus: false,
        showList: [],
        time: getStartEndTime(2),
        level: 0,
    } as {
        params: IPageParams;
        loadStatus: {
            isLoading: boolean;
            isEnd: boolean;
            isError: boolean;
            isEmpty: boolean;
        };
        titleArr: { text: string; key: number; value: number }[];
        time: IStartAndEnd;
        currentTab: number;
        refreshStatus: boolean;
        showList: any[];
        level: number;
    },
    onLoad() {
        this.setData({ level: globalData.level });
        this.getData();
        this.getTabCount();
    },
    handleDataChange: function (e: any) {
        const value = dayjs(e.detail.value).valueOf();
        this.setData({
            time: getMonthStartAndEndTime(value),
        });
        this.Refresh(true);
        this.getTabCount();
    },
    initMonth(time: dayjs.Dayjs) {
        return {
            month: time.format('M月YYYY年'),
            timestamp: time.valueOf(),
            count: '0.00',
            list: [],
        };
    },
    setInitMonth(time: dayjs.Dayjs) {
        this.setData({ showList: [this.initMonth(time)] });
    },
    tabChange({ detail }: { detail: number }) {
        this.setData({ currentTab: detail });
        this.Refresh(true, false, true);
    },
    async getData(pulldown = false) {
        try {
            const data = await this.searchList({ hindLoading: pulldown });
            if (!data.length) {
                return this.setInitMonth(dayjs(this.data.time.endTime * 1000));
            }
            this.setData({ showList: [] });
            const time = dayjs(getNowTime());
            this.setInitMonth(time);
            this.getMonthCount(time, 0);
            data.map((item: any) => {
                this.handleDate(item);
            });
        } catch (error) {
            this.setData({ showList: [] });
        }
    },
    handleDate(item: any) {
        const curMonthIndex = this.data.showList.length - 1;
        const monthTime = dayjs(item.withdrawTime * 1000);
        const month = monthTime.format('M月YYYY年');
        // 如果早当前月份 将当前项放入当前月
        if (month === this.data.showList[curMonthIndex].month) {
            this.setData({
                [`showList[${curMonthIndex}].list`]: this.data.showList[curMonthIndex].list.concat(item),
            });
        } else {
            this.setData({
                [`showList[${curMonthIndex + 1}]`]: this.initMonth(monthTime),
            });
            this.getMonthCount(monthTime, curMonthIndex + 1);
            this.handleDate(item);
        }
    },
    /*
     * 获取底部tab的三个数字
     */
    getTabCount() {
        const { time } = this.data;
        getWithdrawalRecords(time)
            .then(
                (data) => {
                    return [data.allSettlementNum, data.settledNum, data.unSettlementNum];
                },
                (err) => {
                    const str = JSON.stringify(err);
                    if (~str.indexOf('request:fail abort')) {
                        return Promise.reject('tag栏的请求取消了');
                    }
                    return [0, 0, 0];
                },
            )
            .then((res) => {
                let { titleArr } = this.data;
                res.forEach((val, i) => {
                    titleArr[i].value = val;
                });
                this.setData({ titleArr });
            });
    },
    /**
     * 获取每月总数
     */
    getMonthCount(month: any, index: number) {
        const currentTab = this.data.currentTab;
        const monthTime = {
            startTime: dayjs(month).startOf('month').unix(),
            endTime: dayjs(month).endOf('month').unix(),
            settlementStatus: currentTab,
        };
        getWithdrawAmountByMonth(monthTime)
            .then(
                (data) => {
                    return data.withdrawAmount;
                },
                () => {
                    return 0;
                },
            )
            .then((res) => {
                if (this.data.showList[index] && month.valueOf() === this.data.showList[index].timestamp && currentTab === this.data.currentTab) {
                    this.setData({
                        [`showList[${index}].count`]: res || '0.00',
                    });
                }
            });
    },
    resetParams(resetTime = false) {
        this.setData({ params: { ...defaultParams } });
        if (resetTime) {
            this.setData({
                time: getStartEndTime(2),
            });
        }
    },
    clearList() {
        this.setData({ showList: [] });
    },
    /* 公共的 */
    async getPageList() {
        try {
            const data = await this.searchList();
            data.map((item: any) => {
                this.handleDate(item);
            });
        } catch (_) {}
    },
    async pullBottomLoad() {
        try {
            await this.Reset();
        } catch (error) {}
    },
    async pullRefresh() {
        this.Refresh(true, true);
    },
    getParams() {
        const { params, time, currentTab } = this.data;
        return { page: params.page, pageSize: params.pageSize, settlementStatus: currentTab, ...time };
    },
    async searchList(options: any = {}) {
        return new Promise<IWithdrawItem[]>(async (res, rej) => {
            options = Object.assign({ autoStatus: true }, options);
            if (options.hindLoading) {
                this.resetSearch();
            } else {
                this.beginSearch();
            }
            try {
                const params = this.getParams();
                let data = await getWithdrawInfo(params);
                res(data.list);
                if (options.autoStatus) {
                    if (data && typeof data.page === 'number' && typeof data.pages === 'number' && typeof data.total === 'number') {
                        this.afterSearch(data.page, data.pages, data.total);
                    } else {
                        console.error('错误, 该列表非标准滚动加载格式,请去除autoStatus,手动调用afterSearch');
                    }
                }
            } catch (error) {
                const str = JSON.stringify(error);
                if (!~str.indexOf('request:fail abort')) {
                    this.errorSearch();
                    this.setData({ showList: [] });
                    rej(error);
                }
            }
        });
    },
    resetSearch() {
        const { isEnd } = this.data.loadStatus;
        this.setPageStatus(false, isEnd, false, false);
    },
    beginSearch() {
        this.setPageStatus(true, false, false, false);
    },
    /**
     * 请求后
     * @param {Number} page 当前页数
     * @param {Number} pages 总页数
     * @param {Number} total 总数
     */
    afterSearch(page: number, pages: number, total: number) {
        if (typeof page === 'undefined' || typeof pages === 'undefined' || typeof total === 'undefined') {
            return console.error('请求列表参数不全 searchPanel.js');
        }
        const loadStatus = { ...this.data.loadStatus, isLoading: false };

        if (this.data.params.page != page) {
            this.setData({ ['params.page']: page });
        }
        if (this.data.params.total != total) {
            this.setData({ ['params.total']: total });
        }
        if (page >= pages && total != 0) {
            loadStatus.isEnd = true;
        }
        if (total == 0 && page == 1) {
            loadStatus.isEmpty = true;
        }
        this.setData({ 'params.page': this.data.params.page + 1 });
        this.setData({ loadStatus });
    },

    /**
     * 请求失败
     */
    errorSearch() {
        this.setPageStatus(false, false, true, false);
    },

    /**
     * 数据刷新 中间控制器 (重置数据+状态，用于下拉刷新)
     * @param {Boolean} isForce 是否强制刷新 忽略loading
     */
    async searchRefresh(isForce = false) {
        if (this.data.loadStatus.isLoading && !isForce) {
            return Promise.reject('正在请求中');
        }
        this.setData({ params: { ...defaultParams } });
        return true;
    },

    /**
     * 数据继加载 中间控制器 (重置状态，用于上拉加载)
     */
    async searchReset() {
        const { loadStatus } = this.data;
        if (loadStatus.isLoading || loadStatus.isEnd || loadStatus.isEmpty) {
            return Promise.reject('正在请求或已结束');
        }
        return true;
    },
    setPageStatus(isLoading = false, isEnd: status = null, isError: status = null, isEmpty: status = null) {
        const loadStatus = { ...this.data.loadStatus, isLoading };
        if (isEnd !== null) {
            loadStatus.isEnd = isEnd;
        }
        if (isError !== null) {
            loadStatus.isError = isError;
        }
        if (isEmpty !== null) {
            loadStatus.isEmpty = isEmpty;
        }
        this.setData({ loadStatus });
    },
    async Reset() {
        await this.searchReset();
        this.getPageList && this.getPageList();
    },
    async Refresh(isForce = false, pulldown = false, clear = false) {
        await this.searchRefresh(isForce);
        if (clear) {
            this.clearList();
        }
        if (pulldown) {
            this.resetParams(true);
            this.getTabCount();
            await this.getData(pulldown);
            this.setData({ refreshStatus: false });
        } else {
            this.getData(pulldown);
        }
    },
});
