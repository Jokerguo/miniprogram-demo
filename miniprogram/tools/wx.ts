const confirmColor = "#2979FF";

export const Toast = {
    success({ title = "成功", duration = 900, ...rest }: WechatMiniprogram.ShowToastOption) {
        wx.showToast({
            title,
            icon: "success",
            duration,
            ...rest,
        });
    },
    alert({ title = "失败", duration = 1200, ...rest }: WechatMiniprogram.ShowToastOption) {
        wx.showToast({
            title,
            icon: "none",
            duration,
            ...rest,
        });
    },
    hide(){
        wx.hideToast()
    }
};

export const Modal = {
    confirm({ title = "提示", ...rest }: WechatMiniprogram.ShowModalOption) {
        Toast.hide()
        wx.showModal({
            title,
            confirmColor,
            ...rest,
        });
    },
};
