Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        isEmpty: {
            type: Boolean,
            value: false,
        },
        isEnd: {
            type: Boolean,
            value: false,
        },
        isError: {
            type: Boolean,
            value: false,
        },
        endText: {
            type: String,
            value: '已经到底了',
        },
        emptyText: {
            type: String,
            value: '',
        },
        errorText: {
            type: String,
            value: '',
        },
    },
});
