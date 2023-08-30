import { getPromoteUserInfo } from './../../../api/board/index';
import { Toast } from './../../../tools/wx';
import { replaceEmoji, getStartEndTime } from './../../../tools/util';
import { updatePromoteUserRemark } from './../../../api/user-info/client-info';
import dayjs from 'dayjs';
import { globalData } from '../../../tools/global';

interface infoItem {
    nick: string;
    id: number;
    groupTime: number;
    orderCount: number;
    income: string;
}
type status = boolean | null;
type infoList = infoItem[];
type IDataList = infoList[];
Page({
    data: {
        dataList: [] as IDataList,
        showList: [],
        params: {
            page: 1,
            pageSize: 10,
            total: 0,
        },
        secondaryCode: '', //	二级联盟code	query	true
        queryStr: '', // 昵称或备注模糊字段	query	true
        time: getStartEndTime(2),
        refreshStatus: false, // 下拉刷新
        loadStatus: {
            isLoading: false,
            isEnd: false,
            isError: false,
            isEmpty: false,
        },
        level: 0,
        editRemark: '',
        editing: false, //修改备注中
        focus: false,
    } as {
        params: {
            page: number;
            pageSize: number;
            total: number;
        };
        secondaryCode: string;
        queryStr: string;
        time: {
            startTime: number;
            endTime: number;
        };
        dataList: IDataList;
        showList: any[];
        refreshStatus: boolean;
        loadStatus: ILoadStatus;
        level: number;
        editRemark: string;
        editing: boolean;
        focus: boolean;
    },
    //页面操作
    handleDataChange: function (val: { detail: { value: any } }) {
        const {
            detail: { value },
        } = val;
        const time = {
            startTime: dayjs(value).unix(),
            endTime: dayjs(value).endOf('month').unix(),
        };
        this.setData({ time });
        this.Refresh(true, true, false, false);
    },
    handleIpt({ detail }: { detail: string }) {
        this.setData({ queryStr: detail });
    },
    handleSearch() {
        this.Refresh(true, true, false);
    },
    handleRemarkIpt(e: { detail: { value: any } }) {
        let {
            detail: { value },
        } = e;
        if (value.trim() !== '') {
            value = replaceEmoji(value);
        }
        this.setData({ editRemark: value });
        return value;
    },
    async handleRemarkComfirm(detail: any) {
        const editRemark = this.data.editRemark.trim().slice(0,15);
        const {
            mark: { index, subIndex, item },
        } = detail;
        if (!editRemark) {
            // Toast.alert({ title: '备注不能为空' });
            return;
        }
        if (this.data.editing) return;
        this.setData({ editing: true });
        try {
            wx.showLoading({
                title: '备注中...',
                mask: true,
            });
            const { remark } = await updatePromoteUserRemark({ promoteUserId: item.promoteUserId, remark: editRemark });
            if (this.data.showList[index].list[subIndex].promoteUserId === item.promoteUserId) {
                this.setData({
                    [`showList[${index}].list[${subIndex}].showUpdateNick`]: false,
                    [`showList[${index}].list[${subIndex}].remark`]: remark,
                });
            }
            this.setData({ editRemark: '' });
            wx.hideLoading();
            Toast.alert({ title: '备注成功' });
        } catch (error) {
            wx.hideLoading();
            // Toast.alert({ title: '备注失败' });
        }
        this.setData({ editing: false });
    },
    showAllNick({ mark }: WechatMiniprogram.BaseEvent) {
        const { item, index, subIndex } = mark as any;
        if (!item) return;
        const resItem = { ...item, showAllNick: !item['showAllNick'] };
        this.setData({ [`showList[${index}].list[${subIndex}]`]: resItem });
    },
    showUpdateText(detail: { mark: any }) {
        const { mark } = detail;
        if (this.data.showList[mark.index].list[mark.subIndex].showUpdateNick) return;
        let temp: any = null;
        const find = this.data.showList.find(
            (item, index) =>
                item &&
                item.list &&
                item.list.find((i: any, subIndex: number) => {
                    if (i.showUpdateNick) {
                        temp = { showUpdateNick: i.showUpdateNick, index, subIndex };
                    }
                    return i.showUpdateNick;
                }),
        );
        if (find && this.data.editRemark.trim()) return;
        if (temp) {
            this.setData(
                {
                    [`showList[${temp.index}].list[${temp.subIndex}].showUpdateNick`]: false,
                },
                () => {
                    setTimeout(() => {
                        this.setData({
                            editRemark: mark.item.remark || '',
                            [`showList[${mark.index}].list[${mark.subIndex}].showUpdateNick`]: true,
                        });
                    }, 20);
                },
            );
        } else {
            this.setData({
                editRemark: mark.item.remark || '',
                [`showList[${mark.index}].list[${mark.subIndex}].showUpdateNick`]: true,
            });
        }
    },
    // 生命周期函数--监听页面加载
    onLoad(options: any) {
        this.setData({ level: globalData.level });
        if (options.code) {
            this.setData({ secondaryCode: options.code });
        }
        if (options.endTime) {
            this.setData({
                time: {
                    startTime: options.startTime,
                    endTime: options.endTime,
                },
            });
        }
        this.getData();
    },
    resetTime() {
        this.setData({
            time: getStartEndTime(2),
        });
    },
    resetParams() {
        this.setData({
            params: { page: 1, pageSize: 10, total: 0 },
        });
    },
    getQueryParams() {
        let {
            params: { page, pageSize },
            time,
            queryStr,
            secondaryCode,
        } = this.data;
        return { ...time, page, queryStr, secondaryCode, pageSize };
    },
    async getData(pulldown = false) {
        try {
            const params = this.getQueryParams();
            const data = await this.searchList(params, { hindLoading: pulldown });
            this.setData({ showList: [] });
            const list = this.data.showList;
            if (list.length <= 0) {
                const month = dayjs(params.endTime * 1000).format('M月YYYY年');
                this.setData({
                    showList: [
                        {
                            month,
                            count: 0,
                            list: [],
                        },
                    ],
                });
            }
            data.list.map((item: any) => {
                this.handleDate(item);
            });
        } catch (error) {
            this.setData({ showList: [] });
        }
    },

    handleDate(item: any) {
        const curMonthIndex = this.data.showList.length - 1;
        const itemMonth = dayjs(item.bindTime * 1000).format('M月YYYY年');
        item.time = dayjs(item.bindTime * 1000).format('YYYY-MM-DD hh:mm');
        //修改备注
        item.showUpdateNick = false;
        item.showAllNick = false;

        // 如果早当前月份 将当前项放入当前月
        if (itemMonth === this.data.showList[curMonthIndex].month) {
            this.setData({
                [`showList[${curMonthIndex}].list`]: this.data.showList[curMonthIndex].list.concat(item),
            });
        } else {
            const obj = {
                month: itemMonth,
                count: 0,
                list: [],
            };
            this.setData({
                [`showList[${curMonthIndex + 1}]`]: obj,
            });
            this.handleDate(item);
        }
    },
    clearList() {
        this.setData({ showList: [] });
    },
    async getPageList() {
        try {
            const data = await this.searchList(this.getQueryParams());
            data.list.map((item: any) => {
                this.handleDate(item);
            });
        } catch (_) {
            this.clearList();
        }
    },
    async pullBottomLoad() {
        try {
            await this.Reset();
        } catch (error) {}
    },
    async pullRefresh() {
        this.Refresh(true, false, true, true);
    },

    async searchList(param = {}, options: any = {}) {
        options = Object.assign({ autoStatus: true }, options);
        if (options.hindLoading) {
            this.resetSearch();
        } else {
            this.beginSearch();
        }
        let result = await getPromoteUserInfo(param).catch((error) => {
            if (error !== 'request:fail abort') {
                this.errorSearch();
            }
            return Promise.reject(error);
        });
        if (options.autoStatus) {
            if (result && typeof result.page === 'number' && typeof result.pages === 'number' && typeof result.total === 'number') {
                this.afterSearch(result.page, result.pages, result.total);
            } else {
            }
        }

        return result;
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
            return;
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
        } else {
            loadStatus.isEnd = false;
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
        this.getPageList();
    },
    async Refresh(isForce = false, clear = true, pulldown = false, clearTime = true) {
        await this.searchRefresh(isForce);
        if (pulldown) {
            this.setData({ ['params.page']: 1 });
        } else {
            this.resetParams();
        }
        if (clear) {
            this.clearList();
        }
        if (clearTime) {
            this.resetTime();
        }
        if (pulldown) {
            await this.getData(pulldown);
            this.setData({ refreshStatus: false });
        } else {
            this.getData(pulldown);
        }
    },
});
