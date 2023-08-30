import dayjs from 'dayjs';
import {globalData} from './global';

//替换表情符号为''
export const replaceEmoji = function (val: string) {
    if (val.trim() === '') return '';
    const regStr =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
    return val.replace(regStr, '');
};
// 输入框不让输入特殊表情;
export function inputRulesEmoji(attrName: string) {
    return function (this: any, e: { detail: { value: string } }) {
        let {
            detail: { value },
        } = e;
        if (value.trim() !== '') {
            value = replaceEmoji(value);
        }
        this.setData({ [attrName]: value });
        return value;
    };
}

// 获取当前时间戳
export const getNowTime = () => {
    return Date.now() - globalData.timeDiff;
};

/**
 * @param {0 | 1 | 2} type - 0:今日，1：本月，2：累计
 * @description 获取开始，结束时间
 */
export const getStartEndTime = (type: 0 | 1 | 2 = 0) => {
    const time = dayjs(getNowTime());
    return {
        startTime: type === 2 ? 0 : parseInt(time.startOf(type === 0 ? 'date' : 'month').valueOf() / 1000 + ''),
        endTime: parseInt(time.valueOf() / 1000 + ''),
    };
};

/**
 * @param {'date' | 'month'} type
 * @param {0 | 1 | 2} t - 时间节点
 * @description 获取月份开始，结束时间
 */
export const getStartEndTimeByType = (type: 'date' | 'month' = 'date',t?:number |string) => {
    const time = dayjs(t) || dayjs(getNowTime());
    return {
        startTime:  parseInt(time.startOf(type).valueOf() / 1000 + ''),
        endTime: parseInt(time.endOf(type).valueOf() / 1000 + ''),
    };
};

//一天的开始时间
export const getDayStartTime = (data: dayjs.ConfigType) => {
    return +(dayjs(data).startOf('date').valueOf() / 1000).toFixed();
};

//一天的结束时间
export const getDayEndTime = (data: dayjs.ConfigType) => {
    return +(dayjs(data).endOf('date').valueOf() / 1000).toFixed() - 1;
};

/**
 *
 * @param {function} func - 节流触发函数
 * @param {number} wait - 触发间隔(毫秒)
 * @description 节流
 */
export function throttle(func: Function, wait: number = 300) {
    let lastTime: null | number;
    return function (...rest: any[]) {
        if (!lastTime || new Date().getTime() - lastTime > wait) {
            lastTime = +new Date();
            // @ts-ignore
            func.apply(this, rest);
        }
    };
}

/**
 *
 * @param {function} func - 防抖触发函数
 * @param {number} wait - 保护倒计时(毫秒)
 * @description 防抖
 */
export function debounce(func: Function, wait: number = 500) {
    let timeout: any;
    return function () {
        // @ts-ignore
        const context = this;
        const args = [...arguments];
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            func.apply(context, args);
        }, wait);
    };
}
//传入一个时间戳 获取这个时间戳这个月开始和结束时间
export const getMonthStartAndEndTime = (val: number) => {
    return {
        startTime: dayjs(val).startOf('month').unix(),
        endTime: dayjs(val).endOf('month').unix(),
    };
};
