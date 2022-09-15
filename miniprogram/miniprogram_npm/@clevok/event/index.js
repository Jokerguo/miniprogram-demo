module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1662692919634, function(require, module, exports) {

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 获取响应之前上一个路由, 不建议使用这个
 * @return {String} route
 */
function getEmitBeforeRoute() {
    try {
        var routes = getCurrentPages();
        if (!routes)
            return null;
        var l = routes.length;
        if (l === 1 || !l) {
            return null;
        }
        return routes[l - 2].route || routes[l - 2].__route__ || null;
    }
    catch (error) {
        return null;
    }
}
var Event = /** @class */ (function () {
    function Event() {
        /** 存储 */
        this._events = new Map();
    }
    /** 切换命名空间 */
    Event.use = function (moduleName) {
        if (moduleName === void 0) { moduleName = 'default'; }
        if (this._EventMap.has(moduleName)) {
            return this._EventMap.get(moduleName);
        }
        var event = new Event();
        this._EventMap.set(moduleName, event);
        return event;
    };
    Event.prototype.use = function (moduleName) {
        if (moduleName === void 0) { moduleName = 'default'; }
        return Event.use(moduleName);
    };
    /**
     * 注册前准备工作
     * @param name - 事件名
     * @param callback
     * @param self
     */
    Event.prototype.beforeOn = function (name, callback, self) {
        if (self === void 0) { self = '_default'; }
        if (!name) {
            return console.error('缺失监听事件名称');
        }
        if (!callback) {
            return console.error('空回调函数' + name);
        }
        return true;
    };
    /**
     * 订阅
     * @param {String} name - 事件名
     * @param {Function} callback - 回调函数
     * @param {Object} self - 唯一标识
     */
    Event.prototype.on = function (name, callback, self) {
        var _this = this;
        if (self === void 0) { self = '_default'; }
        if (!this.beforeOn(name, callback, self)) {
            return;
        }
        var temp = [callback, self];
        var events = this._events.get(name);
        if (!events) {
            events = [temp];
            this._events.set(name, events);
        }
        else {
            events.unshift(temp);
        }
        return {
            abort: function () {
                _this.off(name, self);
            }
        };
    };
    /**
     * 响应一次后移除
     * @param {String} name - 事件名
     * @param {Function} callback - 回调函数
     * @param {Object} self - 唯一标识
     */
    Event.prototype.once = function (name, callback, self) {
        var _this = this;
        if (self === void 0) { self = '_default'; }
        if (!this.beforeOn(name, callback, self)) {
            return;
        }
        var _callback = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            callback.apply(self, arg);
            _this.off(name, self);
        };
        return this.on(name, _callback, self);
    };
    /**
     * 相同this只能订阅一个, 后一个覆盖前一个, 并把之前的给覆盖掉
     * @param {String} name 监听事件名称
     * @param {Function} callback 回调函数
     * @param {any} self 唯一标识
     */
    Event.prototype.onnewest = function (name, callback, self) {
        if (self === void 0) { self = '_default'; }
        if (!this.beforeOn(name, callback, self)) {
            return;
        }
        var eventList = this._events.get(name);
        if (!eventList)
            return this.on(name, callback, self);
        var findIndex = eventList.findIndex(function (event) {
            if (event[1] === self)
                return true;
            return false;
        });
        if (findIndex !== -1) {
            eventList.splice(findIndex, 1);
        }
        eventList.unshift([callback, self]);
    };
    /**
     * 相同this下已存在, 不允许被覆盖
     * @param {String} name 监听事件名称
     * @param {Function} callback 回调函数
     * @param {Object} self 唯一标识
     */
    Event.prototype.onoldest = function (name, callback, self) {
        if (self === void 0) { self = '_default'; }
        if (!this.beforeOn(name, callback, self)) {
            return;
        }
        var eventList = this._events.get(name);
        if (!eventList)
            return this.on(name, callback, self);
        var findIndex = eventList.findIndex(function (event) {
            if (event[1] === self)
                return true;
            return false;
        });
        if (findIndex !== -1) {
            return;
        }
        eventList.unshift([callback, self]);
    };
    /**
     * (名字取错了,建议用off)
     * 删除标识, 小心了,和外面的不太一, 不是传入回调函数, 而是传入self
     * @param {String} name
     * @param {Object} self
     */
    Event.prototype.remove = function (name, self) {
        if (self === void 0) { self = '_default'; }
        if (!name || !self)
            return console.error('缺少移除参数');
        var eventList = this._events.get(name);
        if (!eventList || eventList.length <= 0) {
            return;
        }
        return eventList.forEach(function (event, index) {
            if (event[1] === self) {
                eventList && eventList.splice(index, 1);
            }
        });
    };
    /**
     *
     * 删除标识, 小心了,和外面的不太一, 不是传入回调函数, 而是传入self
     * 我也不知道这样好不好, 只是感觉这样更加的方便, 在小程序中, 大部分监听只是个普通函数, 要移除只能根据on的回调,或者回调函数移除,太过麻烦
     * 之后是想把event切入page,compontent,拦截销毁事件, 自动移除身上所有的事件
     *
     * @param {String} name
     * @param {Object} self
     */
    Event.prototype.off = function (name, self) {
        if (self === void 0) { self = '_default'; }
        return this.remove(name, self);
    };
    /**
     * 响应
     * @param event
     * @param index
     * @param params
     */
    Event.prototype.callEvent = function (event, index, params) {
        if (!event)
            return;
        var caller = __spreadArrays(params, [
            {
                index: index,
                beforeRoute: getEmitBeforeRoute()
            }
        ]);
        return event[0].apply(event[1], caller);
    };
    /**
     * 特殊,只给最后注册的人发送通知
     * @param {string} name
     * @param {object} arg 额外参数
     */
    Event.prototype.emit = function (name) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var events = this._events.get(name);
        events && this.callEvent(events[0], 0, arg);
    };
    /**
     * 最后注册的,最先被监听
     * @param {string} name
     * @param {object} arg 额外参数
     */
    Event.prototype.emitAll = function (name) {
        var _this = this;
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        var events = this._events.get(name);
        events && events.forEach(function (event, index) {
            _this.callEvent(event, index, arg);
        });
    };
    /** 存储event */
    Event._EventMap = new Map();
    return Event;
}());
exports.Event = Event;
exports.default = Event.use();

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1662692919634);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map