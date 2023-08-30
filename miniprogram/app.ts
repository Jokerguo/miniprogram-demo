App<IAppOption>({
  globalData: {
    version: '1.0.0',
    env: 'develop',
    userInfo: {},
    level: 1, // 联盟等级
    timeDiff: 0, // 系统时差
    requestTasks: {}, //请求任务
  },
  onLaunch() {
    this.initUser();
  },
  // 检测登录
  checkLogin(free = false) {
    return new Promise((resolve, reject) => {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.initUser();
        resolve(true);
      } else {
        if (free) {
          resolve(true);
        } else {
          wx.redirectTo({ url: '/pages/login/login' });
          reject(false);
        }
      }
    });
  },
  // 初始化用户信息
  initUser() {
    this.globalData.env = wx.getAccountInfoSync().miniProgram.envVersion;
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setUserInfo(userInfo);
      this.setToken(userInfo.token);
    }
  },
  // 设置全局userInfo
  setUserInfo(userInfo) {
    this.globalData.userInfo = userInfo;
    this.globalData.level = this.globalData.userInfo.parentCode ? 2 : 1;
  },
  // 设置token
  setToken(token) {
    wx.setStorageSync('token', token);
  },
});
