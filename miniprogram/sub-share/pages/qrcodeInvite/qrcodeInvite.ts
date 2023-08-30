import { taskQrcodeList } from '@/config/index';
const { checkLogin } = getApp<IAppOption>();

Page({
    data: {
        currentItem: {} as TaskQrcode
    },
    async onLoad(options) {
        await checkLogin(true)
        if(options.index){
            this.setData({
                currentItem: taskQrcodeList[Number(options.index)]
            })
        }
    },
    viewImg(){
        wx.previewImage({
            urls: [this.data.currentItem.link],
            showmenu: true
        })
    },
})