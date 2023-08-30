import request from '../../tools/request';

//二级联盟修改推广员备注
export const updatePromoteUserRemark = (params: any) => {
    return request<{ remark: string }>({ url: '/wx/promoteUser/updatePromoteUserRemark', method: 'POST', data: params });
};
