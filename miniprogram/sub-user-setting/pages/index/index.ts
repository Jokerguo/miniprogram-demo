import { Toast } from '@Tool/wx';
import { throttle } from '@Tool/util';
import { getMemberAccountInfo } from '../../../api/setting';
import { globalData } from '../../../tools/global';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        settingInfo: {},
        version: '',
        level: 0,
    } as {
        settingInfo: IMemberAccountInfo;
        version: string;
        level: number;
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.setData({
            version: globalData.version,
            level: globalData.level,
        });
        this.getInfo();
    },
    async getInfo() {
        const res = await getMemberAccountInfo();
        this.setData({ settingInfo: res });
    },
    //退出登陆
    handleLogout: throttle(function () {
        Toast.alert({ title: '退出成功' });
        wx.clearStorageSync();
        setTimeout(() => {
            wx.reLaunch({ url: '/pages/login/login' });
        }, 1300);
    }, 1300),
});
