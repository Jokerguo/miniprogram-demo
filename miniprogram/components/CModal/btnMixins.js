export default Behavior({
    properties: {

        /** 点击按钮是否主动隐藏 modal, 默认 false */
        closeModal: {
            type: Boolean,
            value: false
        },

        /** 设想: 支持以promise形式回调 */
        promise: {
            type: String,
            value: 'then' // then||catch
        }
    }
});
