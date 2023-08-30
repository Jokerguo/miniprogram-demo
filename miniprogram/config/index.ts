import {globalData} from "@Tool/global";
const {code} = globalData.userInfo

// 推广任务
export const taskQrcodeList: TaskQrcode[] = [
    {
        title: '补充快递',
        link: `https://wxapi.fhd001.com/msabase/qrcode?width=240&height=240&needLogo=false&content=${encodeURIComponent(`http://t.fhd001.com/invite/sub-supplementExpress/pages/supplementExpress/supplementExpress?code=${code}`)}`
    },
];


