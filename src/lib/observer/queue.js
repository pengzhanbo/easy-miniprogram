import {logger} from './utils/index';

/**
 * 任务队列类
 */
let id = 0;

class Queue {
    constructor() {
        this.id = ++id;
        this._map = new Map();
        this.timeoutId = null;
    }

    push(task) {
        // // task对象的结构示例
        // const task = {
        //     id: '',
        //     target: {},   // 整合setData调用所必须的字段
        //     updateData: {
        //         key: '',
        //         value: ''
        //     },
        //     fn: () => { // 在setData执行前会执行这个函数先
        //     }
        // };
        if (!task || !task.id) {
            return;
        }
        if (this._map.has(task.id)) {
            this._map.delete(task.id);
        }
        this._map.set(task.id, task);
        this.wait();
    }

    wait() {
        if (!this.timeoutId) {
            this.timeoutId = setTimeout(() => {
                this.flush();
            }, 0);
        }
    }

    flush() {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
        if (this._map.size) {
            const data = {};
            let target = null;
            for (let task of this._map.values()) {
                target = task.target;
                data[task.updateData.key] = task.updateData.value;
                task.fn && task.fn();
            }
            // 统一调用，避免一次性直接调用多次setData，但是这里也存在一个问题
            // @todo: 假如一次性修改的数据过多，要赋值的新数据太大，要如何优化
            target && target.setData(data);
            this._map.clear();
            logger.warn(`call wx 'setData': `, data);
        }
    }
}

const queue = new Queue();

export {Queue};
export default queue;
