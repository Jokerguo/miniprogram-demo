Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        month: {
            type: String,
            value: '',
            observer(newVal) {
                this.handleMonth(newVal);
            },
        },
        rightText: {
            type:String,
            value:''
        }
    },
    data: {
        showMonth: '',
        showYear: '',
    },
    methods: {
        handleDataChange(e) {
            this.triggerEvent('handleDataChange', e.detail);
        },
        handleMonth(e) {
            const index = e.indexOf('月');
            this.setData({
                showMonth: e.slice(0, index + 1),
                showYear: e.slice(index + 1),
            });
        },
    },
});
