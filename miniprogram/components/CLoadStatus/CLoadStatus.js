Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        showPull: {
            type: Boolean,
            value: true,
        },
        loadStatus: {
            type: Object,
            value: {
                isLoading: false,
                isEnd: false,
                isError: false,
                isEmpty: false,
            },
            observer() {
                this.setCss();
            },
        },
        loadText: {
            type: Object,
            observer() {
                this.setLoadText();
            },
        },
        loadSlot: {
            type: Array,
            observer() {
                this.setLoadSlot();
            },
        },
        noLoad: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        cssName: 'isBegin',
        isChange: false,
        _loadText: {
            isLoading: '加载中...',
            isEmpty: '暂无数据',
            isEnd: '已经到底了',
            isError: '加载失败, 重新加载',
        },
    },
    methods: {
        setCss() {
            if (!this.properties.loadStatus) {
                return;
            }
            let arr = ['isLoading', 'isEnd', 'isError', 'isEmpty'];
            let cssName = 'isBegin';
            for (let i = 0; i < 4; i++) {
                if (this.properties.loadStatus[arr[i]]) {
                    cssName = arr[i];
                    break;
                }
            }

            if (this.data.cssName !== cssName) {
                let change = {
                    cssName,
                };
                if (!this.data.isChange) {
                    change.isChange = true;
                }
                this.setData(change);
            }
        },
        reLoad() {
            this.triggerEvent('searchReset');
        },
        setLoadText() {
            if (!this.properties.loadText || typeof this.properties.loadText !== 'object') {
                return;
            }
            this.setData({
                _loadText: Object.assign(
                    {
                        isLoading: '加载中...',
                        isEmpty: '暂无数据',
                        isEnd: '已经到底了',
                        isError: '加载失败, 重新加载',
                    },
                    this.properties.loadText,
                ),
            });
        },
        setLoadSlot() {
            if (!this.properties.loadSlot || !this.properties.loadSlot.length) {
                return;
            }
            let express = {};
            this.properties.loadSlot.forEach((key) => {
                express[key] = true;
            });
            this.setData({
                _loadSlot: express,
            });
        },
    },
});
