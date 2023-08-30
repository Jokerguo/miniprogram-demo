import request from '../../tools/request';

// 分组列表
export const getGroupByCode = (data = {}) => {
    return request<GroupRes[]>({ url: '/wx/group/getGroupByCode', data, method: 'GET' });
};

