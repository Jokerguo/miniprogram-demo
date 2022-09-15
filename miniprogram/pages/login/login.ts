import { test1 } from '../../api/user/index';

Page({
    data: { },
    onLoad() {
    },
    handleEvent() { 
    },
    login() { 
        test1({ name: '过' }).then(res => { 
            console.log(res,'===============res')
        })
    }
})