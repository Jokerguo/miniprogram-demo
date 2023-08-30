import { getOneAccountAmountInfo, getAllianceSettleAccount, getTwoAccountAmountInfo, withdrawMoneyV2 } from '../../../api/moneyInfo/moneyInfo';
import { Modal, Toast } from '../../../tools/wx';
import { globalData } from '../../../tools/global';

Page({
    data: {
        confirmModal: false,

        amountInfo: {
            totalPrice: '--',
            canCarryPrice: '--',
        },
        level: 0,
        settleAccount: {}, //提现信息
        getSettleAccout: false,
    } as {
        confirmModal: boolean;
        amountInfo: IOneAccountAmountInfo;
        level: number;
        getSettleAccout: boolean;
        settleAccount: IAllianceSettleAccount;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({ level: globalData.level });
        this.initData();
    },
    async initData() {
        let amountInfo;
        if (this.data.level === 1) {
            amountInfo = await getOneAccountAmountInfo();
        } else {
            amountInfo = await getTwoAccountAmountInfo();
        }
        this.setData({ amountInfo });
    },

    //获取联盟账户结算信息
    async getSettleAcount() {
        if (this.data.settleAccount.operName) return;
        if (this.data.getSettleAccout) throw '结算信息请求中...';
        this.setData({ getSettleAccout: true });
        try {
            const res = await getAllianceSettleAccount();
            this.setData({ settleAccount: res });
            this.setData({ getSettleAccout: false });
        } catch (error) {
            this.setData({ getSettleAccout: false });
            throw '请求账户信息错了';
        }
    },
    async handleWithdraw() {
        try {
            await this.getSettleAcount();
            const { settleAccount } = this.data;
            if (!settleAccount.bankcard) {
                Modal.alert('请联系运营添加账户后再提现', { title: '提示', confirmText: '我知道了' }).then((res) => {
                });
            } else {
                this.openConfirmModal();
            }
        } catch (error) {}
    },
    openConfirmModal() {
        if (this.data.confirmModal) return;
        this.setData({
            confirmModal: true,
        });
    },
    closeOrderCodeShow() {
        this.setData({ confirmModal: false });
    },
    //点击了确认提现按钮
    async handleConfirm() {
        try {
            const res = await withdrawMoneyV2({ amount: this.data.settleAccount.widthDrawMoney });
            this.closeOrderCodeShow();
            Toast.alert({ title: '提现成功' });
            this.initData();
        } catch (error) {
            this.closeOrderCodeShow();
        }
    },
});
