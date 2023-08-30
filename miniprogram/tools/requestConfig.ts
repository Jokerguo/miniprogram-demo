import {globalData} from './global';
import { Modal } from './wx';

// baseUrl集合
const baseUrlMap: {
    [key: string]: string;
} = {
    base: 'https://lm.fhd001.com',
};
//请求白名单
const whiteRequestList = ['/wx/settleAccount/getIncomeAmountByMonth','/wx/settleAccount/getWithdrawAmountByMonth'];

// 完整url
export const getBaseUrl = (baseUrl = '', url = '') => {
    return baseUrlMap[baseUrl || 'base'] + url;
};

// 取消请求
export const cancelRequest = (baseUrl = '', url = '') => {
    const { requestTasks } = globalData;
    if (requestTasks[baseUrl] && whiteRequestList.indexOf(url) === -1) {
        try {
            requestTasks[baseUrl].abort();
            delete requestTasks[baseUrl];
        } catch (e) {
            console.error('取消请求失败', e);
        }
    }
};

// 重新登录
export const againLogin = () => {
  Modal.confirm({
      content: '登录凭证过期，请重新登录',
      showCancel: false,
      success: (res) => {
          if (res.confirm) {
              wx.reLaunch({ url: '/pages/login/login' });
          }
      },
  });
};

// 统一报错
export const handleError = (res: Response<any>) => {
  const content = (res.data.errorMsg || res.data.data || '未知错误') + ' traceId：' + (res.data.traceId || '');
  Modal.confirm({
      content,
      showCancel: false,
      success: () => {
          globalData.env !== 'release' && wx.setClipboardData({ data: content });
      },
  });
};
