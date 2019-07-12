/**
 * 自定义事件系统类
 */

class Event {
    /**
     * 构造器
     * @param _enableMultiple 标记该事件实例是否允许同一事件挂载多个处理函数
     */
    constructor(_enableMultiple = true) {
        this._enableMultiple = _enableMultiple;
        this._beforeHandlers = {default: []}; // 前置处理器集合
        this._handlers = {}; // 事件名对应的处理器集合
        this._afterHandlers = {default: []}; // 后置处理器集合
    }

    /**
     * 绑定事件处理函数
     * @param name 事件名字
     * @param handler 对应的事件处理函数
     * @param enableMultiple 标记该事件是否允许挂载多个处理函数
     */
    on(name, handler, enableMultiple) {
        enableMultiple = enableMultiple === undefined ? this._enableMultiple : enableMultiple;
        if (enableMultiple) {
            if (!this._handlers[name]) {
                this._handlers[name] = [];
            }
            this._handlers[name].push(handler);
        } else {
            this._handlers[name] = [handler];
        }
    }

    /**
     * 绑定前置处理函数
     * @param name
     * @param handler
     */
    onBefore(name, handler) {
        name = name || 'default';
        if (!this._beforeHandlers[name]) {
            this._beforeHandlers[name] = [];
        }
        this._beforeHandlers[name].push(handler);
    }

    /**
     * 绑定后置处理函数
     * @param name
     * @param handler
     */
    onAfter(name, handler) {
        name = name || 'default';
        if (!this._afterHandlers[name]) {
            this._afterHandlers[name] = [];
        }
        this._afterHandlers[name].push(handler);
    }

    /**
     * 销毁对应的处理函数
     * @param name 事件名
     */
    off(name, func) {
        if (!this._enableMultiple || !func) {
            delete this._handlers[name];
        } else {
            if (this._handlers[name]) {
                let index = this._handlers[name].indexOf(func);
                index !== -1 && this._handlers[name].splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     * @param name 事件名
     * @param args 参数数组，传递给各个事件处理函数
     */
    emit(name, ...args) {
        let handlers = this._handlers[name] || [];
        let event = {stop: false};
        let length = handlers.length;
        // 传递给事件处理函数的第一个参数为事件对象
        // 该对象拥有一些可能会有用的属性和函数（比如可以终止处理函数链的执行exit）
        args = args.concat([{
            name: name, // 事件名
            length: length, // 事件处理函数的数量
            /**
             * 阻止继续执行函数处理链并退出
             */
            exit() {
                event.stop = true;
            }
        }]);
        if (length) {
            // 添加前置处理
            if (this._beforeHandlers[name]) {
                handlers = this._beforeHandlers[name].concat(handlers);
            } else if (this._beforeHandlers.default) {
                handlers = this._beforeHandlers.default.concat(handlers);
            }
            // 添加后置处理
            if (this._afterHandlers[name]) {
                handlers = handlers.concat(this._afterHandlers[name]);
            } else if (this._afterHandlers.default) {
                handlers = handlers.concat(this._afterHandlers.default);
            }
            // 仅当存在处理函数时才执行
            handlers.forEach(handler => {
                !event.stop && handler.apply(this, args);
            });
        }
    }
}

// 全局唯一的事件实例
let event = new Event(true);

/**
 * 单例模式
 * @type {{getInstance: (())}}
 */
const EventFactory = {
    /**
     * 获取事件单例
     */
    getInstance() {
        return event;
    }
};

export {EventFactory};
export default Event;
