import {globalData} from "@Tool/global";

Component({
    data: {
        version: '1.0.0',
        code: '',
    },
    attached(){
        this.setData({
            version: globalData.version,
            code: globalData.userInfo.code,
        })
    }
});