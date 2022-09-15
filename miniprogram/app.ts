import Event from "@clevok/event";
import dayjs from "dayjs";
import uba from "./tools/uba";

App<IAppOption>({
  globalData: {
    token: "token----------=====",
    requestTask: null,
  },
  onLaunch() {
    // 登录
    wx.login({
      success: (res) => {
        console.log(res.code);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    });
  },
});
