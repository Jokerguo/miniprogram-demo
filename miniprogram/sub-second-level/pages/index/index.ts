import Event from '@clevok/event';
import { getGroupByCode } from '@Api/group/index';
import { getMemberInfoByGroup } from '@Api/secondLevel/index';

Page({
    data: {
        // 分组列表 无分组：-1
        groups: [{ groupId: -1, groupName: '全部' }] as GroupRes[],
        currentGroup: -1,
        // 成员原始数据
        list: [] as Member[],
        // 处理后数据
        memberList: [] as MemberList[],
        param: {
            page: 1,
            pageSize: 20,
        },
        total: 0,
        loadStatus: {
            isLoading: false,
            isEnd: false,
            isError: false,
            isEmpty: false,
        } as ILoadStatus,
        queryStr: ''
    },
    onLoad() {
        this.getGroup();
        this.getMember();
        this.bindEvent()
    },
    /**
     * 获取成员列表
     * @param reset 重置 
     */
    async getMember(reset: boolean = false) {
        if(reset){
            this.setData({
                param:{...this.data.param, page:1}
            })
        }
        this.setData({
            loadStatus:{
                isLoading: true,
                isEnd: false,
                isError: false,
                isEmpty: false,
            }
        })
        try {
            // 查询分组是否还存在
            if(this.data.groups.findIndex(i=> i.groupId === this.data.currentGroup) === -1){
                this.setData({ currentGroup: -1 })
            }
            const { list, total } = await getMemberInfoByGroup({ ...this.data.param, groupId: this.data.currentGroup, fuzzyName: this.data.queryStr });
            this.setData({ list:reset ? list : [...this.data.list,...list], total });
            this.handleData();
        } catch (error) {
            this.setData({
                loadStatus:{
                    isLoading: false,
                    isEnd: false,
                    isEmpty: false,
                    isError: true
                }
            })
        }
    },
    // 成员数据处理
    handleData() {
        const list = this.data.list;
        // 去重后的分组id
        const groupIds = [...new Set(list.map((i) => i.groupId))].sort();
        // groupId:0 放最后
        const index =  groupIds.findIndex(i=>i === 0)
        if(index !== -1){
            groupIds.splice(index,1)
            groupIds.push(0)
        }
        const result: MemberList[] = [];
        groupIds.forEach((id) => {
            result.push({
                groupId: id,
                amount:this.data.groups.find(i=>i.groupId === id)?.customersCount || 0,
                list: list.filter((i) => i.groupId === id),
            });
        });
        this.setData({ memberList: result });
        this.setData({
            loadStatus:{
                isLoading: false,
                isEnd: this.data.total !== 0 && list.length === this.data.total,
                isError: false,
                isEmpty: result.length === 0
            }
        })
    },
    // 获取分组
    async getGroup() {
        try {
            const data = await getGroupByCode({queryStr:this.data.queryStr});
            this.setData({
                groups: [...this.data.groups, ...data],
            });
        } catch (error) { }
     
    },
    // 选择分组
    selectGroup(e: WechatMiniprogram.BaseEvent) {
        const { id } = e.currentTarget.dataset;
        this.setData({ currentGroup: id, param: this.data.param });
        this.getMember(true);
    },
    // 搜索框
    async handleIpt (e: any){
        this.setData({ queryStr: e.detail })
    },
    async handleSearch(){
        await this.getGroup();
        await this.getMember(true);
    },
    linkTo(e: any) {
        const {code,status} = e.mark.item
        if(!code)return 
        wx.navigateTo({
            url: `/sub-second-level/pages/detail/detail?code=${code}&status=${status}`
        })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        await this.getGroup();
        this.getMember(true);
        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        const currentTotal = this.data.memberList.map((i) => i.list.length).reduce((i, j) => i + j, 0);
        if (currentTotal < this.data.total) {
            this.setData({
                param: {
                    ...this.data.param,
                    page: this.data.param.page + 1,
                },
            });
            this.getMember();
        }
    },
    bindEvent(){
        // 更新二级联盟列表
        Event.on('update-second-list',()=>{
            this.getMember(true)
        })
    }
});
