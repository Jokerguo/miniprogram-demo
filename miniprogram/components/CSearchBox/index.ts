import { debounce, replaceEmoji } from '../../tools/util';
Component({
    options: {
        multipleSlots: true,
        addGlobalClass: true,
    },
    properties: {
        placeholder: {
            type: String,
            value: '请输入搜索关键词',
        },
        searchKey: {
            type: String,
            value: '',
        },
        fixed: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        oldQueryStr: '',
        val: '',
    },
    methods: {
        // handleIpt(e: { detail: { value: any } }) {
        handleIpt(e: WechatMiniprogram.Input) {
            let {
                detail: { value },
            } = e;
            if (value.trim() !== '') {
                value = replaceEmoji(value);
            }
            this.triggerEvent('handleIpt', value);
            this.setData({ val: value });
            return value;
        },
        handleSearch: debounce(function (this: any) {
            const { oldQueryStr, searchKey } = this.data;
            if (oldQueryStr === searchKey) return;
            this.setData({ oldQueryStr: searchKey });
            this.triggerEvent('handleSearch');
        }, 100),
        blur() {
            this.handleSearch();
        },
        clearVal() {
            this.triggerEvent('handleIpt', '');
            this.handleSearch();
        },
    },
});
