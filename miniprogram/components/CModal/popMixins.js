export default Behavior({
    options: {
        multipleSlots: true
    },
    properties: {
        sync: String,
        show: {
            type: Boolean,
            value: false,
            observer(newvalue) {
                if (typeof newvalue === 'boolean' && this.data._show !== newvalue) {
                    if (newvalue) {
                        this.show();
                    } else {
                        this.hide();
                    }
                }
            }
        },

        /** 点击蒙层是否允许关闭 */
        maskClosable: {
            type: Boolean,
            value: true
        },
        key: {
            type: String,
            value: ''
        },
        ubaText: {
            type: String,
            value: ''
        },
    },
    data: {
        _show: false,

        /** 总开关, show用于动画展示 */
        modalOpen: false
    },
    ready () {
        this.handleCallback = null;
    },
    methods: {
        changeModalStatus (status = false) {
            this.handleCallback && clearTimeout(this.handleCallback);

            if (status) {
                return;
            }
            /** 关闭 */
            this.handleCallback = setTimeout(() => {
                this.handleCallback = null;
                this.setData({
                    modalOpen: false
                });
            }, 600);
        },
        changeSync (value = false) {
            this.properties.sync && this.triggerEvent('ing', {type: 'sync', value, sync: this.properties.sync})
        },
        show () {
            this.setData({
                _show: true,
                modalOpen: true
            });
            this.changeModalStatus(true);
            this.changeSync(true);
            this.triggerEvent('show');
        },
        hide () {
            this.setData({
                _show: false
            });
            this.changeModalStatus(false);
            this.changeSync(false);
            this.triggerEvent('hide');
        },
        $tapMask () {
            const key = this.properties.key
            const ubaText = this.properties.ubaText
            if(key){
                const obj = {}
                if(ubaText){
                    obj.text=ubaText
                }
                wx.$Uba({fid: key,params:obj})();
            }
            /** 点击遮罩层 */
            this.triggerEvent('tapMask');
            this.properties.maskClosable && this.hide();
        },
        $catch () {}
    }
});
