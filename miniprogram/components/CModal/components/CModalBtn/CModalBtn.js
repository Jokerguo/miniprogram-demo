Component({
    properties: {
        /** 是否跳转页面 */
        url: String,
        key: String,
        className: {
            type: String,
            value: 'child',
        },
        /** 点击按钮是否主动隐藏 modal, 默认 false */
        closeModal: {
            type: Boolean,
            value: false,
        },

        /** 设想: 支持以promise形式回调 */
        promise: {
            type: String,
            value: 'then', // then||catch
        },
    },
    data: {
    },
    relations: {
        './index': {
            type: 'ancestor',
            linked(target) {
                this.$cModal = target;
            },
        },
    },

    methods: {
        $click() {
            this.triggerEvent('click');
        },
    },
});
