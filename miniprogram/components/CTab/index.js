Component({
    properties: {
        titleArr: {
            type: Array,
            value: [],
        },
        currentTab: {
            type: Number,
            value: 0,
        },
        showNum: {
            type: Boolean,
            value: false,
        },
        left: {
            type: String,
            value: '60px',
        },
        topBorder: {
            type: Boolean,
            value: false,
        },
    },
    data: {},
    ready() {
        this.getLeft();
    },
    methods: {
        selectType(event) {
            const index = event.currentTarget.dataset.index;
            this.triggerEvent('change', index);
            this.getLeft();
        },
        getLeft() {
            const that = this;
            const query = that.createSelectorQuery();
            query.select('.color_red').boundingClientRect();
            query.selectViewport().scrollOffset();
            query.exec(function (res) {
                const { left, width } = res[0];
                that.setData({ left: left + (width - 31) / 2 + 'px' });
            });
        },
    },
});
