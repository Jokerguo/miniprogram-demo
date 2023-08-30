import popMixins from './popMixins';
import btnMixins from './btnMixins';
Component({
    properties: {
        title: {
            type: String,
            value: '提示',
            observer(newvalue) {
                if (typeof newvalue === 'boolean' && this.data._show !== newvalue) {
                    if (newvalue) {
                        this.setData({
                            destoryModal: false,
                        });
                        this.show();
                    } else {
                        this.hide();
                    }
                }
            },
        },
        bodyStyle: String,
        contentStyle: String,
        wrapStyle: String,
        titleStyle: String,
    },
    options: {
        multipleSlots: true,
    },
    behaviors: [popMixins],
    relations: {
        btnMixins: {
            type: 'descendant',
            target: btnMixins,
        },
    },
});
