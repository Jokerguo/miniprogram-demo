import request from '../../tools/request';


// 二级联盟列表
export const getMemberInfoByGroup = (data = {}) => {
    return request<ListResponse<Member>>({ url: '/wx/account/getMemberInfoByGroupOrName',method:'GET', data });
};

// 一级获取二级联盟成员信息
export const getMemberInfo = (data = {}) => {
    return request<MemberInfo>({ url: '/wx/account/getMemberInfo',method:'GET', data });
};

// 一级获取二级联盟成员推广信息
export const getMemberPromoteInfo = (data = {}) => {
    return request<MemberPromoteInfo>({ url: '/wx/account/getMemberPromoteInfo',method:'GET', data });
};

// 冻结
export const updateAllianceMemberStatus = (data = {}) => {
    return request<Boolean>({ url: '/fhd/alliance/updateAllianceMemberStatus.do',data });
};

// 修改名称
export const updateMemberName = (data = {}) => {
    return request<Boolean>({ url: '/wx/account/updateMemberName',data });
};

