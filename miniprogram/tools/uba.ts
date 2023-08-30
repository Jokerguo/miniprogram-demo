// 打点
const uba = (option: { fid: string; params?: any }) => {
    try {
        let pages = getCurrentPages();
        let url = "https://click.xyy001.com/click?";
        let data = Object.assign(option, {
            params: option.params ? JSON.stringify(option.params) : "",
            referer: "q",
            p: "jslm",
            pid: "jslm",
            m: "q",
            uid: getApp().globalData?.userInfo?.userId || "",
            version: getApp().globalData?.version || "",
            path: pages[pages.length - 1].route,
            _: parseInt((+new Date() / 1000).toString()),
        });
        url += qsData(data);
        request(url);
    } catch (error) {
        console.log("error", error);
    }
};

const request = (url: string) => {
    return new Promise((resolve, reject) => {
        wx.request({
            url,
            method: "GET",
            timeout: 15000,
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            dataType: "json",
            success: (res) => {
                resolve(res.data);
            },
            fail: (res) => {
                reject(res);
            },
        });
    });
};

const qsData = (data: { [x: string]: string | number | boolean }) => {
    let qsData = "";
    for (const key in data) {
        qsData += `${key}=${encodeURIComponent(data[key])}&`;
    }
    qsData = qsData.slice(0, qsData.length - 1);
    return qsData;
};

export default uba;
