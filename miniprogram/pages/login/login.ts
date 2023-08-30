import { App } from '@Tool/global';
import { login } from '@Api/user/index';
import { throttle } from '@Tool/util';
import { Toast } from '@Tool/wx';

Page({
    data: {
        userName: '',
        password: '',
        showPassword: false, // 显示密码
        isLoading: false,
        focus: false
    },
    onShow() {
        wx.hideHomeButton();
    },
    handleLogin: throttle(async function (){
        // @ts-ignore
        const that = this
        if (!that.data.userName && !that.data.password) {
            return Toast.alert({ title: '请输入账号密码' });
        }
        if (!that.data.userName) {
            return Toast.alert({ title: '请输入账号' });
        }
        if (!that.data.password) {
            return Toast.alert({ title: '请输入密码' });
        }
        try {
            that.setData({ isLoading: true })
            const data = await login({ username: that.data.userName, password: that.data.password });
            if (data) {
                wx.setStorageSync('userInfo',data);
                App.initUser()
                Toast.alert({ title: '登录成功', duration: 900 });
                setTimeout(() => {
                    wx.redirectTo({ url: '/pages/home/home' });
                    that.setData({ isLoading: false })
                }, 800);
            }
        } catch (err) {
            that.setData({ isLoading: false })
            Toast.alert({ title: '账号密码错误' });
        } 
    }),

    toggleShow() {
        this.setData({ showPassword: !this.data.showPassword,focus: false });
    },
    handleInput(e: WechatMiniprogram.Input) {
        const value = e.detail.value;
        this.setData({ password: value.replace(/[^\w\/]/gi, '') });
        return value.replace(/[^\w\/]/gi, '');
    },
});
