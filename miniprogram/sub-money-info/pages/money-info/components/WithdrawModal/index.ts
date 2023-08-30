import { behavior as computedBehavior } from 'miniprogram-computed';
Component({
    behaviors: [computedBehavior],
    computed: {
        sum(data: { _show: any }) {
            return data._show;
        },
    },
    properties: {
        showModal: {
            type: Boolean,
            value: false,
            observer(newvalue) {
                console.log(newvalue);
                if (typeof newvalue === 'boolean' && this.data._show !== newvalue) {
                    if (newvalue) {
                        this.setData({
                            _show: true,
                            destoryModal: false,
                        });
                    } else {
                        this.setData(
                            {
                                _show: false,
                            },
                            () => {
                                setTimeout(() => {
                                    this.setData({ destoryModal: true });
                                }, 250);
                            },
                        );
                    }
                }
            },
        },
        settleAccount: {
            type: Object,
            value: {},
        },
        amountInfo: {
            type: Object,
            value: {},
        },
    },
    data: {
        destoryModal: false,
        _show: false,
    },
    methods: {
        confirm() {
            this.triggerEvent('confirm');
        },
        cancel() {
            this.triggerEvent('cancel');
        },
    },
});
