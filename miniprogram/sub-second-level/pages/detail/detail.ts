import { getMemberPromoteInfo, getMemberInfo, updateAllianceMemberStatus, updateMemberName } from '@Api/secondLevel/index';
import { Modal, Toast } from '@Tool/wx';
import Event from '@clevok/event';
import { getNowTime, getStartEndTimeByType, replaceEmoji } from '@Tool/util';
import dayjs from 'dayjs';

Page({
    data: {
        showInput: false, //显示编辑框
        editName: '',
        showPhone: false,
        code: '',
        status: 0, // 0未冻结 1已冻结
        memberInfo: {} as MemberInfo,
        promoteInfo: {
            promotionCustomersNum: 0,
            promotionIncome: '0',
            promotionOrder: 0,
        },
        isSelecting: false,
        time: '',
    },
    onLoad(options) {
        if (options.code) {
            this.setData({
                code: options.code,
            });
        }
        // 冻结状态
        if (options.status) {
            this.setData({
                status: parseInt(options.status),
            });
        }
        this.setData({
            time: dayjs(getNowTime()).format('YYYY-MM'),
        });
        this.getInfo();
        this.getPromoteInfo();
    },
    // 用户信息
    async getInfo() {
        const data = await getMemberInfo({ code: this.data.code });
        this.setData({
            memberInfo: data,
        });
    },
    // 推广信息
    async getPromoteInfo() {
        const data = await getMemberPromoteInfo({ code: this.data.code, ...getStartEndTimeByType('month', this.data.time) });
        this.setData({
            promoteInfo: data,
        });
    },
    // 操作
    handleAction() {
        const { status } = this.data;
        wx.showActionSheet({
            itemList: [status ? '解除冻结' : '冻结'],
            success: () => {
                Modal.confirm({
                    content: status ? '解除冻结后允许对方再次登录\n是否解除?' : '冻结后对方无法再登录\n是否冻结',
                    confirmText: status ? '解除' : '冻结',
                    success: (e) => {
                        if (e.confirm) {
                            this.updateStatus();
                        }
                    },
                });
            },
        });
    },
    // 冻结状态更新
    updateStatus() {
        const { status } = this.data;
        updateAllianceMemberStatus({ code: this.data.code, status: status ? 0 : 1 }).then((data) => {
            if (data) {
                Event.emit('update-second-list');
                Toast.success({ title: status ? '解除成功' : '冻结成功', icon: 'none' });
                this.setData({
                    status: status ? 0 : 1,
                });
            }
        });
    },
    // 查看手机号
    toggleShow() {
        Toast.success({ title: !this.data.showPhone ? '已显示' : '已隐藏', icon: 'none' });
        this.setData({
            showPhone: !this.data.showPhone,
        });
    },
    // 编辑名称
    handleEdit() {
        this.setData({ editName: this.data.memberInfo.name, showInput: true });
    },
    handleInput(e: WechatMiniprogram.Input) {
        let {
            detail: { value },
        } = e;
        value = replaceEmoji(value);
        return value;
    },
    async handleBlur(e: WechatMiniprogram.InputBlur) {
        if (e.detail.value === this.data.memberInfo.name) {
            this.setData({ showInput: false });
            return;
        }
        try {
            const result = await updateMemberName({ code: this.data.code, name: e.detail.value });
            if (result) {
                Toast.alert({ title: '修改成功' });
                Event.emit('update-second-list');
                this.setData({ memberInfo: { ...this.data.memberInfo, name: e.detail.value } });
            } else {
                Toast.alert({ title: '修改失败' });
            }
        } catch (error) {
        } finally {
            this.setData({ showInput: false });
        }
    },
    // 选择时间
    selectTime() {
        this.setData({ isSelecting: true });
    },
    timeChange(e: any) {
        this.setData({ time: e.detail.value });
        this.cancelTime();
        this.getPromoteInfo();
    },
    cancelTime() {
        this.setData({ isSelecting: false });
    },
    // 跳转
    linkTo(e: WechatMiniprogram.BaseEvent) {
        const {index} = e.mark || {};
        if(!index)return
        const { startTime, endTime } = getStartEndTimeByType('month', this.data.time);
        wx.navigateTo({
            url:
                index === 1
                    ? `/sub-user-info/pages/client-info/client-info?code=${this.data.code}&startTime=${startTime}&endTime=${endTime}`
                    : `/sub-money-info/pages/order-history/order-history?code=${this.data.code}&type=3&startTime=${startTime}&endTime=${endTime}`,
        });
    },
});
