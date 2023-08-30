Component({
    properties: {
        // hasOnce 事件只允许触发一次
        hasOnce: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        once: false,
    },

    methods: {
        handleConfirm() {
            const { once } = this.data;
            const { hasOnce } = this.data;
            if ((!once && hasOnce) || !hasOnce) {
                if (hasOnce) this.setData({ once: true });
                this.triggerEvent('confirm');
            }
        },
        handleCancel() {
            this.triggerEvent('cancel');
        },
    },
});
