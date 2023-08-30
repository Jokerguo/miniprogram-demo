Component({
    options: {
        addGlobalClass: true,
    },
    properties: {
        url: {
            type: String,
            value: '',
        },
        wrapStyle: {
            type: String,
            value: '',
        },
    },
    methods: {
        toPage() {
            const url = this.data.url;
            if (url) {
                wx.navigateTo({ url });
            } else {
                console.warn('没有传递url');
            }
        },
    },
});
